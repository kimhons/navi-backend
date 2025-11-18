const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    formatted: String
  },
  category: {
    type: String,
    enum: ['restaurant', 'gas-station', 'parking', 'hotel', 'attraction', 'shopping', 'hospital', 'other'],
    default: 'other'
  },
  phone: String,
  website: String,
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  photos: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  amenities: [String],
  priceLevel: {
    type: Number,
    min: 1,
    max: 4
  },
  verified: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ category: 1 });
placeSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Place', placeSchema);
