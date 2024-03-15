const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  groupId: {
    type: String,
    ref: 'Group',
  },
  sender: {
    type: String,
  },
  to: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Message should not be empty'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seen: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
  ],
});

MessageSchema.pre(/^find/, function (next) {
  this.find().populate('group');
  next();
});

const Message = new mongoose.model('Message', MessageSchema);

module.exports = Message;
