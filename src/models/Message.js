const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'location', 'image', 'route'],
    default: 'text'
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  },
  attachments: [{
    url: String,
    type: String,
    filename: String
  }],
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ group: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
