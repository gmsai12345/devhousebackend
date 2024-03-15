// const express = require('express');
 const { getPost, like, dislike,getPostById} = require('../controllers/post');

// const postRoutes = express.Router();
// // postRoutes.post('/post',post);
// // postRoutes.get('/get',get);
// module.exports = postRoutes;
const express = require("express");
const upload = require("../utils/upload");
const Post = require("../models/post");
const {
  uploadToCloudinary,
} = require("../utils/cloudinary");
const postrouter = express.Router();

//Create a User
postrouter.post("/post", async (req, res) => {
  try {
    const {userId,content,type,postType} = req.body;
    console.log(userId);
    const newpost = new Post({
        userId,
        content,
        type,postType});
    await newpost.save();
    res.status(201).send(newpost);
  } catch (error) {
    res.status(400).send("not working");
  }
});

// Upload User Image
postrouter.put("/postimage/:id", upload.single("userImage"), async (req, res) => {
  try {
  //  console.log("came here");
    //Upload Image to Cloudinary
    const data = await uploadToCloudinary(req.file.path, "user-images");
    //Save Image Url and publiId ti the database
    const savedImg = await Post.updateOne(
      { postId: req.params.id },
      {
        $set: {
            imageUrl: data.url,
        },
      }
    );

    res.status(200).send("user image uploaded with success!");
  } catch (error) {
    res.status(400).send(error);
  }
});
postrouter.get("/getpost/:type",getPost)
postrouter.get("/getpostbyid/:id",getPostById)
postrouter.get("/increase-likes",like)
postrouter.get("/decrease-likes",dislike)

module.exports = postrouter;