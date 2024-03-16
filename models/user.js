const mongoose = require('mongoose');
const uuid4 = require('uuid4');
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default:uuid4(),
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber:
  {
    type:Number
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'professional', 'recruiter'],
    required: true
  },
  profile: {
    studentfollowers: [{
      type: String,
    }],
    professsionalfollowers: [{
      type: String,
    }],
    recruiterfollowers: [{
      type: String,
    }],
    studentfollowing: [{
      type: String,
    }],
    professionalfollowing: [{
      type: String,
    }],
    recruiterfollowing: [{
      type: String,
    }],
    experience: 
    {
      type:String
    },
    linkedinLink:String,
    achievements: [String],
    education: {type:String},
    skills: [String],
    mentorshipStatus: {
      type: Boolean,
      default: false
    },
    jobDescription:
    {
        type:String
    },
    mentorshipRate: {
      type: Number,
      default: 0
    },
    calendarLink: String,
    notifications: [{
      type: String,
    }],
    JobsPosted: [{
        type: String, // job ids
      }]
  },
  dp: String,
  posts: [{
    type: String, // post ids
  }],
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  coins: {
    type: Number
  },
  community: [{
    type: String, // Community ids
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
