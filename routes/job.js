const express = require('express');
const { post,filter,getJobsByType,getJobsById } = require('../controllers/job');

const jobRoutes = express.Router();
jobRoutes.post('/post', post);
jobRoutes.get('/filter', filter);
// jobRoutes.get('/getJobs', getJobs);
jobRoutes.get('/getJobtype/:type', getJobsByType);
jobRoutes.get('/getJobid/:id', getJobsById);
module.exports = jobRoutes;
