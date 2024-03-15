const mongoose = require('mongoose');
const uuid4 = require('uuid4');

const jobSchema = new mongoose.Schema({
  jobId:{
    type:String,
    default:uuid4()
  },
  recruiterId: {
    type: String,
    ref: 'User', // Reference to the User model
    required: true
  },
  skillsRequired:[String],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['internship', 'fulltime', 'freelance'],
    required: true
  },
  url: {
    type: String
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
