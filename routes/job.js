const express = require('express');
const { post,filter,getJobsByType,getJobsById,getalljobs } = require('../controllers/job');

const jobRoutes = express.Router();
jobRoutes.post('/post', post);
jobRoutes.get('/filter', filter);
// jobRoutes.get('/getJobs', getJobs);
jobRoutes.get('/getJobtype/:type', getJobsByType);
jobRoutes.get('/getJobid/:id', getJobsById);
jobRoutes.get('/get',getalljobs);
module.exports = jobRoutes;
