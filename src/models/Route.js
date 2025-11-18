const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
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
  address: String,
  name: String,
  order: Number
}, { _id: false });

const routeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  origin: {
    type: waypointSchema,
    required: true
  },
  destination: {
    type: waypointSchema,
    required: true
  },
  waypoints: [waypointSchema],
  distance: {
    type: Number, // in meters
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: [[Number]] // Array of [longitude, latitude]
  },
  routeType: {
    type: String,
    enum: ['fastest', 'shortest', 'eco', 'avoid-highways'],
    default: 'fastest'
  },
  transportMode: {
    type: String,
    enum: ['driving', 'walking', 'cycling', 'transit'],
    default: 'driving'
  },
  trafficEnabled: {
    type: Boolean,
    default: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date
}, {
  timestamps: true
});

// Create geospatial index
routeSchema.index({ 'origin.location': '2dsphere' });
routeSchema.index({ 'destination.location': '2dsphere' });
routeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Route', routeSchema);
