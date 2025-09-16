const Product = require('../models/Product');
const SearchTrend = require('../models/SearchTrend');
const UserSearchHistory = require('../models/UserSearchHistory');
const redis = require('redis');
const { promisify } = require('util');

// Basic logger (can be replaced with a more robust one like Winston)
const logger = {
  error: (message, ...args) => console.error(`[SearchService] ${message}`, ...args),
  info: (message, ...args) => console.log(`[SearchService] ${message}`, ...args)
};

class SearchService {
  constructor(redisClient, options = {}) {
    if (redisClient) {
      this.redisClient = redisClient;
      this.redisGet = promisify(redisClient.get).bind(redisClient);
      this.redisSet = promisify(redisClient.set).bind(redisClient);
    } else {
      logger.info('Redis client not provided; caching will be disabled.');
    }

    this.config = {
      cacheTTL: options.cacheTTL || 3600, // 1 hour
      historyLimit: options.historyLimit || 50,
      suggestionsLimit: options.suggestionsLimit || 10,
      relatedProductsLimit: options.relatedProductsLimit || 8,
    };
  }

  async search(query, filters = {}, options = {}) {
    try {
      // ... (rest of the search logic remains the same)

      if (options.userId && query && query.trim()) {
        await UserSearchHistory.addSearch(options.userId, query, filters);
      }

      if (query && query.trim()) {
        await SearchTrend.updateTrend(query);
      }

      // ... (rest of the return statement)
    } catch (error) {
      logger.error('Error during search:', error);
      throw new Error('An error occurred during the search operation.');
    }
  }

  async getSuggestions(query, limit) {
    const suggestionLimit = limit || this.config.suggestionsLimit;
    if (!query || query.length < 2) return [];

    try {
      const suggestions = new Set();

      const productSuggestions = await Product.aggregate([/* ... */]);
      productSuggestions.forEach(item => suggestions.add(item._id));

      const popularSuggestions = await SearchTrend.find({ query: new RegExp(query, 'i') })
        .sort({ count: -1 })
        .limit(5);

      popularSuggestions.forEach(trend => suggestions.add(trend.query));

      return Array.from(suggestions).slice(0, suggestionLimit);
    } catch (error) {
      logger.error('Error getting suggestions:', error);
      return [];
    }
  }

  async getAvailableFilters(query = '', currentFilters = {}) {
    const cacheKey = `filters:${query}:${JSON.stringify(currentFilters)}`;
    if (this.redisClient) {
      const cachedFilters = await this.redisGet(cacheKey);
      if (cachedFilters) return JSON.parse(cachedFilters);
    }

    try {
      // ... (aggregation pipeline remains the same)
      const result = await Product.aggregate(/* ... */);
      
      if (this.redisClient) {
        await this.redisSet(cacheKey, JSON.stringify(result), 'EX', this.config.cacheTTL);
      }

      return result;
    } catch (error) {
      logger.error('Error getting available filters:', error);
      return { /* default empty filters */ };
    }
  }

  async getUserSearchHistory(userId, limit) {
    try {
      const history = await UserSearchHistory.findOne({ userId });
      return history ? history.searches.slice(0, limit || this.config.historyLimit) : [];
    } catch (error) {
      logger.error('Error getting user search history:', error);
      return [];
    }
  }

  async clearUserSearchHistory(userId) {
    try {
      await UserSearchHistory.updateOne({ userId }, { $set: { searches: [] } });
      return true;
    } catch (error) {
      logger.error('Error clearing user search history:', error);
      return false;
    }
  }

  async getRelatedProducts(productId, limit) {
    const product = await Product.findById(productId);
    if (!product) return [];
  
    const cacheKey = `related:${productId}`;
    if (this.redisClient) {
      const cachedProducts = await this.redisGet(cacheKey);
      if (cachedProducts) return JSON.parse(cachedProducts);
    }
  
    try {
      const related = await Product.aggregate(/* ... */);
  
      if (this.redisClient) {
        await this.redisSet(cacheKey, JSON.stringify(related), 'EX', this.config.cacheTTL);
      }
  
      return related;
    } catch (error) {
      logger.error('Error getting related products:', error);
      return [];
    }
  }

  async getSearchTrends(limit = 10) {
    try {
      return await SearchTrend.find()
        .sort({ count: -1 })
        .limit(limit)
        .select('query count');
    } catch (error) {
      logger.error('Error getting search trends:', error);
      return [];
    }
  }

  async getPersonalizedSuggestions(userId, limit) {
    try {
      const history = await UserSearchHistory.findOne({ userId });
      if (!history || history.searches.length === 0) {
        // Fallback to popular products
        return Product.find({ isActive: true, featured: true })
          .sort({ averageRating: -1, totalReviews: -1 })
          .limit(limit || this.config.suggestionsLimit);
      }
  
      // ... (logic for personalized suggestions remains the same)
  
      return Product.find(/* ... */);
    } catch (error) {
      logger.error('Error getting personalized suggestions:', error);
      return [];
    }
  }

}

// Export a singleton instance with a default Redis client connection
let searchServiceInstance;

try {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  redisClient.connect();
  searchServiceInstance = new SearchService(redisClient);
} catch (e) {
  logger.error('Could not create Redis client, proceeding without cache.');
  searchServiceInstance = new SearchService();
}

module.exports = searchServiceInstance;
