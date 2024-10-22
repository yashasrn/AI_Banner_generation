const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  text: { type: String, required: true },
  fontStyle: { type: String, required: true },
  image: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', BannerSchema);
