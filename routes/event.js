const express = require('express');
const { post,getEvents,getEventById,getallevents } = require('../controllers/event');
const eventRoutes = express.Router();
eventRoutes.post('/post', post);
eventRoutes.get('/event/:type', getEvents);
eventRoutes.get('/eventbyid/:id', getEventById);
eventRoutes.get('/get',getallevents)
// jobRoutes.get('/getJobs', getJobs);
module.exports = eventRoutes;
