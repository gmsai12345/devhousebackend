const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/job');
const postrouter = require('./routes/post');
const eventRoutes = require('./routes/event');
const {hatespeechdetection} = require("./controllers/hatespeechdetection")
const {imagedetection}=require('./controllers/imagedetection');
const app = express();
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.MONGODB_URI;
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
mongoose.set('strictQuery', true);
mongoose.connect(CONNECTION_URL,/* { useNewUrlParser: true, useUnifiedTopology: true }*/)
  .then(() => {
    console.log("MongoDB connected successfully");
    // Start the server after the database connection is established
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use('/user', userRoutes);
app.use('/job', jobRoutes);
app.use('/post', postrouter);
app.use('/event', eventRoutes);
app.use('/hatespeechdetection',hatespeechdetection)
app.use('/imagedetection',imagedetection)
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server started');
});
const io = require('socket.io')(server, { pingTimeout: 60000 });

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('authenticated', (userId) => {
    console.log(userId, 'auth');
    socket.join(userId);
  });
  socket.on('join room', (groupId) => {
    socket.join(groupId);
  });
  socket.on('message', ({ groupId, message }) => {
    socket.broadcast.to(groupId).emit('message', { groupId, message });
  });
  socket.on('seen', (groupId) => {
    socket.broadcast.to(groupId).emit('seen', groupId);
  });
  socket.on('render', (groupId) => {
    socket.broadcast.to(groupId).emit('render', groupId);
  });
  socket.on('notification', async (msg) => {
    const notification = await Notification.create(msg);
    socket.broadcast.to(msg.to).emit('notification');
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
