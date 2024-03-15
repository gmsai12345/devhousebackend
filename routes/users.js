const express = require('express');
const { login, signup,follow,onBoard,unfollow } = require('../controllers/users');

const userRoutes = express.Router();

// Route to handle user signup
userRoutes.post('/signup', signup);

// Route to handle user login
userRoutes.post('/login', login);
userRoutes.post('/onBoard', onBoard);
userRoutes.post('/follow', follow);
userRoutes.post('/unfollow', unfollow);
module.exports = userRoutes;
