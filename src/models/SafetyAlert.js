const mongoose = require('mongoose');

const safetyAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['speed_camera', 'police', 'accident', 'hazard', 'construction', 'traffic'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  description: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmed: {
    type: Number,
    default: 0
  },
  expired: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, {
  timestamps: true
});

safetyAlertSchema.index({ location: '2dsphere' });
safetyAlertSchema.index({ type: 1, expired: 1 });

module.exports = mongoose.model('SafetyAlert', safetyAlertSchema);
