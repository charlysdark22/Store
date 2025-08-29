const Product = require('../models/Product');
const User = require('../models/User');

class SearchService {
  constructor() {
    this.popularSearches = new Map();
    this.searchSuggestions = new Map();
    this.userSearchHistory = new Map();
  }

  // Búsqueda principal con múltiples criterios
  async search(query, filters = {}, options = {}) {
    const {
      page = 1,
      limit = 12,
      sortBy = 'relevance',
      sortOrder = 'desc',
      userId = null
    } = options;

    // Construir pipeline de agregación
    const pipeline = [];

    // Stage 1: Filtros básicos
    const matchStage = {
      isActive: true
    };

    // Filtro por categoría
    if (filters.category) {
      matchStage.category = filters.category;
    }

    // Filtro por subcategoría
    if (filters.subcategory) {
      matchStage.subcategory = filters.subcategory;
    }

    // Filtro por marca
    if (filters.brand) {
      matchStage.brand = new RegExp(filters.brand, 'i');
    }

    // Filtro por rango de precio
    if (filters.minPrice || filters.maxPrice) {
      matchStage.price = {};
      if (filters.minPrice) matchStage.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) matchStage.price.$lte = Number(filters.maxPrice);
    }

    // Filtro por calificación mínima
    if (filters.minRating) {
      matchStage.averageRating = { $gte: Number(filters.minRating) };
    }

    // Filtro por disponibilidad
    if (filters.inStock === 'true') {
      matchStage.stock = { $gt: 0 };
    }

    // Filtro por productos destacados
    if (filters.featured === 'true') {
      matchStage.featured = true;
    }

    // Filtro por especificaciones
    if (filters.specifications) {
      for (const [key, value] of Object.entries(filters.specifications)) {
        matchStage[`specifications.${key}`] = new RegExp(value, 'i');
      }
    }

    pipeline.push({ $match: matchStage });

    // Stage 2: Búsqueda por texto si hay query
    if (query && query.trim()) {
      const searchTerms = query.trim().split(/\s+/);
      const searchConditions = [];

      for (const term of searchTerms) {
        const termRegex = new RegExp(term, 'i');
        searchConditions.push({
          $or: [
            { 'name.es': termRegex },
            { 'name.en': termRegex },
            { 'name.fr': termRegex },
            { 'description.es': termRegex },
            { 'description.en': termRegex },
            { 'description.fr': termRegex },
            { brand: termRegex },
            { model: termRegex },
            { category: termRegex },
            { subcategory: termRegex },
            { 'specifications.processor': termRegex },
            { 'specifications.operatingSystem': termRegex },
            { 'specifications.color': termRegex }
          ]
        });
      }

      pipeline.push({
        $match: {
          $and: searchConditions
        }
      });

      // Agregar score de relevancia
      pipeline.push({
        $addFields: {
          relevanceScore: {
            $add: [
              // Puntuación por coincidencia en nombre (mayor peso)
              {
                $cond: [
                  { $regexMatch: { input: '$name.es', regex: query, options: 'i' } },
                  10, 0
                ]
              },
              // Puntuación por coincidencia en marca
              {
                $cond: [
                  { $regexMatch: { input: '$brand', regex: query, options: 'i' } },
                  8, 0
                ]
              },
              // Puntuación por coincidencia en modelo
              {
                $cond: [
                  { $regexMatch: { input: '$model', regex: query, options: 'i' } },
                  6, 0
                ]
              },
              // Puntuación por coincidencia en descripción
              {
                $cond: [
                  { $regexMatch: { input: '$description.es', regex: query, options: 'i' } },
                  4, 0
                ]
              },
              // Bonus por calificación alta
              { $multiply: ['$averageRating', 0.5] },
              // Bonus por productos destacados
              { $cond: ['$featured', 2, 0] },
              // Penalty por stock bajo
              { $cond: [{ $lt: ['$stock', 5] }, -1, 0] }
            ]
          }
        }
      });
    }

    // Stage 3: Ordenamiento
    let sortStage = {};
    
    switch (sortBy) {
      case 'relevance':
        if (query && query.trim()) {
          sortStage = { relevanceScore: -1, averageRating: -1 };
        } else {
          sortStage = { featured: -1, averageRating: -1 };
        }
        break;
      case 'price':
        sortStage = { price: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'rating':
        sortStage = { averageRating: -1, totalReviews: -1 };
        break;
      case 'newest':
        sortStage = { createdAt: -1 };
        break;
      case 'popular':
        sortStage = { totalReviews: -1, averageRating: -1 };
        break;
      case 'name':
        sortStage = { 'name.es': sortOrder === 'asc' ? 1 : -1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    pipeline.push({ $sort: sortStage });

    // Stage 4: Paginación
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    // Ejecutar búsqueda
    const products = await Product.aggregate(pipeline);

    // Contar total sin paginación
    const countPipeline = pipeline.slice(0, -2); // Remover skip y limit
    countPipeline.push({ $count: 'total' });
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Guardar búsqueda en historial si hay usuario
    if (userId && query && query.trim()) {
      await this.saveSearchHistory(userId, query, filters);
    }

    // Actualizar búsquedas populares
    if (query && query.trim()) {
      this.updatePopularSearches(query);
    }

    return {
      products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        limit: Number(limit)
      },
      appliedFilters: filters,
      query: query || ''
    };
  }

  // Obtener sugerencias de búsqueda
  async getSuggestions(query, limit = 10) {
    if (!query || query.length < 2) return [];

    const suggestions = new Set();

    // Sugerencias de productos
    const productSuggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          $or: [
            { 'name.es': new RegExp(query, 'i') },
            { 'name.en': new RegExp(query, 'i') },
            { brand: new RegExp(query, 'i') },
            { model: new RegExp(query, 'i') }
          ]
        }
      },
      {
        $project: {
          suggestions: [
            '$name.es',
            '$brand',
            '$model',
            { $concat: ['$brand', ' ', '$model'] }
          ]
        }
      },
      { $unwind: '$suggestions' },
      {
        $match: {
          suggestions: new RegExp(query, 'i')
        }
      },
      { $group: { _id: '$suggestions' } },
      { $limit: limit }
    ]);

    productSuggestions.forEach(item => {
      if (item._id && item._id.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item._id);
      }
    });

    // Sugerencias de búsquedas populares
    const popularSuggestions = Array.from(this.popularSearches.keys())
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    popularSuggestions.forEach(search => suggestions.add(search));

    return Array.from(suggestions).slice(0, limit);
  }

  // Obtener filtros disponibles para una búsqueda
  async getAvailableFilters(query = '', currentFilters = {}) {
    const matchStage = { isActive: true };

    // Aplicar búsqueda por texto si existe
    if (query && query.trim()) {
      const searchTerms = query.trim().split(/\s+/);
      const searchConditions = searchTerms.map(term => ({
        $or: [
          { 'name.es': new RegExp(term, 'i') },
          { 'name.en': new RegExp(term, 'i') },
          { brand: new RegExp(term, 'i') },
          { model: new RegExp(term, 'i') }
        ]
      }));
      matchStage.$and = searchConditions;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          categories: { $addToSet: '$category' },
          brands: { $addToSet: '$brand' },
          subcategories: { $addToSet: '$subcategory' },
          colors: { $addToSet: '$specifications.color' },
          processors: { $addToSet: '$specifications.processor' },
          operatingSystems: { $addToSet: '$specifications.operatingSystem' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minRating: { $min: '$averageRating' },
          maxRating: { $max: '$averageRating' }
        }
      }
    ];

    const result = await Product.aggregate(pipeline);
    
    if (result.length === 0) {
      return {
        categories: [],
        brands: [],
        subcategories: [],
        priceRange: { min: 0, max: 0 },
        ratingRange: { min: 0, max: 5 },
        specifications: {
          colors: [],
          processors: [],
          operatingSystems: []
        }
      };
    }

    const data = result[0];

    return {
      categories: data.categories.filter(Boolean).sort(),
      brands: data.brands.filter(Boolean).sort(),
      subcategories: data.subcategories.filter(Boolean).sort(),
      priceRange: {
        min: Math.floor(data.minPrice || 0),
        max: Math.ceil(data.maxPrice || 0)
      },
      ratingRange: {
        min: Math.floor(data.minRating || 0),
        max: Math.ceil(data.maxRating || 5)
      },
      specifications: {
        colors: data.colors.filter(Boolean).sort(),
        processors: data.processors.filter(Boolean).sort(),
        operatingSystems: data.operatingSystems.filter(Boolean).sort()
      }
    };
  }

  // Búsqueda visual (por imagen - preparado para futuro)
  async visualSearch(imageBuffer, options = {}) {
    // Placeholder para búsqueda por imagen
    // En el futuro se puede integrar con servicios como Google Vision API
    // o TensorFlow para reconocimiento de productos
    
    return {
      products: [],
      confidence: 0,
      detectedFeatures: [],
      suggestedQuery: ''
    };
  }

  // Búsqueda por voz (preparado para futuro)
  async voiceSearch(audioBuffer, options = {}) {
    // Placeholder para búsqueda por voz
    // Se puede integrar con Google Speech-to-Text o similar
    
    return {
      transcription: '',
      confidence: 0,
      searchResults: []
    };
  }

  // Obtener búsquedas populares
  getPopularSearches(limit = 10) {
    return Array.from(this.popularSearches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  // Obtener historial de búsqueda del usuario
  async getUserSearchHistory(userId, limit = 20) {
    // En una implementación real, esto se guardaría en base de datos
    const userHistory = this.userSearchHistory.get(userId) || [];
    return userHistory.slice(0, limit);
  }

  // Limpiar historial de búsqueda
  async clearUserSearchHistory(userId) {
    this.userSearchHistory.delete(userId);
    return true;
  }

  // Obtener productos relacionados
  async getRelatedProducts(productId, limit = 8) {
    const product = await Product.findById(productId);
    if (!product) return [];

    const pipeline = [
      {
        $match: {
          _id: { $ne: product._id },
          isActive: true,
          $or: [
            { category: product.category },
            { brand: product.brand },
            { subcategory: product.subcategory }
          ]
        }
      },
      {
        $addFields: {
          similarityScore: {
            $add: [
              { $cond: [{ $eq: ['$category', product.category] }, 5, 0] },
              { $cond: [{ $eq: ['$brand', product.brand] }, 3, 0] },
              { $cond: [{ $eq: ['$subcategory', product.subcategory] }, 2, 0] },
              {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$price', product.price * 0.7] },
                      { $lte: ['$price', product.price * 1.3] }
                    ]
                  },
                  1, 0
                ]
              }
            ]
          }
        }
      },
      { $sort: { similarityScore: -1, averageRating: -1 } },
      { $limit: limit }
    ];

    return await Product.aggregate(pipeline);
  }

  // Autocompletar búsqueda
  async autocomplete(query, limit = 5) {
    if (!query || query.length < 2) return [];

    const suggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          $or: [
            { 'name.es': new RegExp(`^${query}`, 'i') },
            { brand: new RegExp(`^${query}`, 'i') },
            { model: new RegExp(`^${query}`, 'i') }
          ]
        }
      },
      {
        $project: {
          text: '$name.es',
          type: 'product',
          category: '$category',
          image: { $arrayElemAt: ['$images', 0] },
          price: '$price'
        }
      },
      { $limit: limit }
    ]);

    return suggestions;
  }

  // Métodos privados
  updatePopularSearches(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const currentCount = this.popularSearches.get(normalizedQuery) || 0;
    this.popularSearches.set(normalizedQuery, currentCount + 1);
  }

  async saveSearchHistory(userId, query, filters) {
    const userHistory = this.userSearchHistory.get(userId) || [];
    
    const searchEntry = {
      query,
      filters,
      timestamp: new Date(),
      id: Date.now().toString()
    };

    // Evitar duplicados recientes
    const isDuplicate = userHistory.some(entry => 
      entry.query === query && 
      Date.now() - entry.timestamp.getTime() < 60000 // 1 minuto
    );

    if (!isDuplicate) {
      userHistory.unshift(searchEntry);
      // Mantener solo los últimos 50 búsquedas
      if (userHistory.length > 50) {
        userHistory.splice(50);
      }
      this.userSearchHistory.set(userId, userHistory);
    }
  }

  // Análisis de tendencias de búsqueda
  getSearchTrends(period = '7d') {
    const trends = Array.from(this.popularSearches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([query, count]) => ({
        query,
        count,
        growth: Math.floor(Math.random() * 100) - 50 // Placeholder
      }));

    return trends;
  }

  // Sugerir productos basados en historial
  async getPersonalizedSuggestions(userId, limit = 12) {
    const userHistory = this.userSearchHistory.get(userId) || [];
    
    if (userHistory.length === 0) {
      // Si no hay historial, devolver productos populares
      return await Product.find({ isActive: true, featured: true })
        .sort({ averageRating: -1, totalReviews: -1 })
        .limit(limit);
    }

    // Extraer categorías y marcas más buscadas
    const categoryCount = {};
    const brandCount = {};

    userHistory.forEach(entry => {
      if (entry.filters.category) {
        categoryCount[entry.filters.category] = (categoryCount[entry.filters.category] || 0) + 1;
      }
      if (entry.filters.brand) {
        brandCount[entry.filters.brand] = (brandCount[entry.filters.brand] || 0) + 1;
      }
    });

    const topCategories = Object.keys(categoryCount)
      .sort((a, b) => categoryCount[b] - categoryCount[a])
      .slice(0, 3);

    const topBrands = Object.keys(brandCount)
      .sort((a, b) => brandCount[b] - brandCount[a])
      .slice(0, 3);

    // Buscar productos basados en preferencias
    const matchConditions = [];
    
    if (topCategories.length > 0) {
      matchConditions.push({ category: { $in: topCategories } });
    }
    
    if (topBrands.length > 0) {
      matchConditions.push({ brand: { $in: topBrands } });
    }

    if (matchConditions.length === 0) {
      matchConditions.push({ featured: true });
    }

    return await Product.find({
      isActive: true,
      $or: matchConditions
    })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);
  }
}

module.exports = new SearchService();