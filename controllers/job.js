const Job = require('../models/job.js');
exports.post = async (req, res) => {
    try {
        // Extract job details from the request body
        const { recruiterId, skillsRequired, title, description, location, salary, applicationDeadline,isProcessed,isActive, type, url,companyDescription,companyName } = req.body;
    
        // Create a new job object
        const newJob = new Job({
          recruiterId,
          skillsRequired,
          title,
          description,
          location,
          salary,
          applicationDeadline,
          isProcessed,
          companyDescription,
          companyName,
          isActive,
          type,
          url
        });
    
        // Save the job to the database
        const savedJob = await newJob.save();
    
        res.status(201).json(savedJob); // Respond with the saved job object
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }    
}
exports.filter = async (req, res) => {
  try {
    const { skills } = req.body;
    // const processedSkills = skills.map(skill => skill.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
    const query = { skillsRequired: { $all: skills } };
    const filteredJobs = await Job.find(query);
    res.json(filteredJobs);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
}
exports.getJobsByType = async (req, res) => {
  try {
    const {type}=req.params;
    const allJobs = await Job.find({type});
    res.json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
exports.getJobsById = async (req, res) => {
  try {
    const {id}=req.params;
    const allJobs = await Job.find({id});
    res.json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
