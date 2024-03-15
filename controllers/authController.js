const User = require('../models/user')
exports.getProfileId = async (req, res, next) => {
    const id = await User.findOne({ userId: req.user.id });
  
    req.profile = id._id;
  
    next();
  };