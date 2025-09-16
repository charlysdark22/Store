const mongoose = require('mongoose');

const searchTrendSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true, index: true },
  count: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now }
});

searchTrendSchema.statics.updateTrend = async function(query) {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return;

  return this.findOneAndUpdate(
    { query: normalizedQuery },
    { $inc: { count: 1 }, $set: { lastSearched: new Date() } },
    { upsert: true, new: true }
  );
};

const SearchTrend = mongoose.model('SearchTrend', searchTrendSchema);

module.exports = SearchTrend;
