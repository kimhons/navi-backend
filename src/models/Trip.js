const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  name: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: Number, // in seconds
  distance: Number, // in meters
  averageSpeed: Number, // in km/h
  maxSpeed: Number,
  fuelUsed: Number, // in liters
  carbonFootprint: Number, // in kg CO2
  path: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: [[Number]] // Actual path taken
  },
  stats: {
    stops: Number,
    idleTime: Number,
    movingTime: Number,
    calories: Number
  },
  incidents: [{
    type: {
      type: String,
      enum: ['traffic', 'accident', 'construction', 'hazard', 'police']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    timestamp: Date,
    description: String
  }],
  photos: [{
    url: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    timestamp: Date
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

tripSchema.index({ user: 1, startTime: -1 });
tripSchema.index({ 'path.coordinates': '2dsphere' });

module.exports = mongoose.model('Trip', tripSchema);
