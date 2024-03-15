const express = require('express');
const { post,getEvents } = require('../controllers/event');
const eventRoutes = express.Router();
eventRoutes.post('/post', post);
eventRoutes.get('/event/:type', getEvents);
// jobRoutes.get('/getJobs', getJobs);
module.exports = eventRoutes;
