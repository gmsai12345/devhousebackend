const Event = require('../models/event');
exports.post= async(req,res)=>
{
    try {
        // Extract contest details from the request body
        const { title, description, startTime, endTime, type } = req.body;
    
        // Create a new contest object
        const newContest = new Event({
          title,
          description,
          startTime,
          endTime,
          type
        });
    
        // Save the contest to the database
        const savedContest = await newContest.save();
    
        // Respond with the saved contest object
        res.status(201).json(savedContest);
      } catch (error) {
        console.error('Error creating contest:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}
exports.getEvents= async(req,res)=>
{
    try {
        const eventType = req.params.type;
            const events = await Event.find({ type: eventType });
    
        res.json(events);
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}