const express = require('express');
const { post,getEvents,getEventById } = require('../controllers/event');
const eventRoutes = express.Router();
eventRoutes.post('/post', post);
eventRoutes.get('/event/:type', getEvents);
eventRoutes.get('/eventbyid/:type', getEventById);
// jobRoutes.get('/getJobs', getJobs);
module.exports = eventRoutes;
