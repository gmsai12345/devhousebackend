const mongoose = require('mongoose');
const uuid4 = require('uuid4');

const postSchema = new mongoose.Schema({
  postId:
  {
    type:String,
    default:uuid4()
  },
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes:{type:Number,default:0},
  type: {
    type: String,
    enum: ['student', 'professional', 'recruiter'],
  },
  postType:
  {
    type: String,
    // enum: ['ReactJs', 'NodeJs', 'AUTOCAD','MATLAB','LTSPICE','ARM','Chemical Engineering','Computer Science Engineer','Electrical Engineer','Full Stack'],
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
