const express = require('express');
const { post,filter,getJobs } = require('../controllers/job');

const jobRoutes = express.Router();
jobRoutes.post('/post', post);
jobRoutes.get('/filter', filter);
jobRoutes.get('/getJobs', getJobs);
module.exports = jobRoutes;
