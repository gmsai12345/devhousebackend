const Post = require("../models/post");
const User = require("../models/user");
exports.getPost=async(req,res)=>
{
    try {
        const { type } = req.params;
    
        // Fetch posts based on type
        const posts = await Post.find({ type });
    
        res.status(200).json({ posts });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      } 
}
exports.getPost=async(req,res)=>
{
    try {
        const { type } = req.params;
    
        // Fetch posts based on type
        const posts = await Post.find({ type });
    
        res.status(200).json({ posts });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      } 
}
exports.like=async(req,res)=>
{
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "postId is required in the query parameters" });
    }

    // Find the post by postId and update the likes field
    const post = await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
exports.dislike=async(req,res)=>
{
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "postId is required in the query parameters" });
    }

    // Find the post by postId and update the likes field
    const post = await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// exports.getPost=async(req,res)=>
// {
//     try {
//         const {type } = req.params;
//         const {userId} = req.query;
//         const user = await User.findById(userId);
    
//         if (!user) {
//           return res.status(404).json({ message: "User not found" });
//         }
    
//         let followers, following;
//         switch (type) {
//           case 'student':
//             followers = user.profile.studentfollowers;
//             following = user.profile.studentfollowing;
//             break;
//           case 'professional':
//             followers = user.profile.professioanlfollowers;
//             following = user.profile.professionalfollowing;
//             break;
//           case 'recruiter':
//             followers = user.profile.recruiterfollowers;
//             following = user.profile.recruiterfollowing;
//             break;
//           default:
//             return res.status(400).json({ message: "Invalid user type" });
//         }
    
//         // Combine followers and following
//         const allFollowers = [...followers, ...following];
    
//         // Fetch posts for all followers and following
//         let allPosts = [];
//         for (const followerId of allFollowers) {
//           const posts = await Post.find({ userId: followerId });
//           allPosts = allPosts.concat(posts);
//         }
    
//         res.status(200).json({ posts: allPosts });
//       } catch (error) {
//         res.status(500).json({ message: "Internal server error" });
//       }
// }
