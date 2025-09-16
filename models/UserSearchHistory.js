const mongoose = require('mongoose');

const userSearchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  searches: [{
    query: { type: String, required: true },
    filters: { type: Object },
    timestamp: { type: Date, default: Date.now }
  }]
});

userSearchHistorySchema.statics.addSearch = async function(userId, query, filters) {
  if (!userId || !query || !query.trim()) return;

  const searchEntry = {
    query: query.trim(),
    filters: filters || {},
    timestamp: new Date()
  };

  const history = await this.findOne({ userId });

  if (history) {
    // Avoid recent duplicates (e.g., within the last minute)
    const isDuplicate = history.searches.some(entry => 
      entry.query === searchEntry.query &&
      (new Date() - entry.timestamp) < 60000
    );

    if (!isDuplicate) {
      history.searches.unshift(searchEntry);
      // Keep only the last 50 searches
      if (history.searches.length > 50) {
        history.searches.splice(50);
      }
      return history.save();
    }
  } else {
    return this.create({
      userId,
      searches: [searchEntry]
    });
  }
};

const UserSearchHistory = mongoose.model('UserSearchHistory', userSearchHistorySchema);

module.exports = UserSearchHistory;
