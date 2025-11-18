const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  photos: [{
    url: String,
    caption: String
  }],
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ place: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
