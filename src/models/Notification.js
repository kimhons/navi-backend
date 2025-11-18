const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['friend_request', 'message', 'trip_invite', 'achievement', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
