const mongoose = require('mongoose');
const uuid4 = require('uuid4');

const contestSchema = new mongoose.Schema({
  eventId:
  {
    type:String,
    default:uuid4()
  },
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
    // required:true
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
