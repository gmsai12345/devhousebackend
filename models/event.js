const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  url:
  {
    type:String,
    required:true
  },
  endTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['contests', 'hackathon', 'conference'],
    required: true
  }
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
