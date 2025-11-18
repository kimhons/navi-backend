const mongoose = require('mongoose');

const offlineMapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true
  },
  bounds: {
    northeast: {
      lat: Number,
      lng: Number
    },
    southwest: {
      lat: Number,
      lng: Number
    }
  },
  size: {
    type: Number, // in bytes
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: Date,
  version: String,
  status: {
    type: String,
    enum: ['downloading', 'completed', 'failed', 'outdated'],
    default: 'completed'
  }
}, {
  timestamps: true
});

offlineMapSchema.index({ user: 1 });

module.exports = mongoose.model('OfflineMap', offlineMapSchema);
