const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  avatar: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

groupSchema.index({ owner: 1 });
groupSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Group', groupSchema);
