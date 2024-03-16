const express = require('express');
const { login, signup,follow,onBoard,unfollow,getById,search,getfollow,getmentors } = require('../controllers/users');

const userRoutes = express.Router();
userRoutes.post('/signup', signup);
userRoutes.post('/login', login);
userRoutes.post('/onBoard', onBoard);
userRoutes.post('/follow', follow);
userRoutes.post('/unfollow', unfollow);
userRoutes.get('/getbyid', getById);
userRoutes.get('/search', search);
userRoutes.get('/getfollow', getfollow);
userRoutes.get('/getmentors', getmentors);
module.exports = userRoutes;
