const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

// Function to handle user signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role,mobileNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      mobileNumber,
      coins: 0, // Assuming coins start from 0
      loggedIn:true
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Function to handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is null, it means no user was found with the provided email
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update loggedIn field to true if password is valid
    await User.updateOne({ email }, { loggedIn: true });

    // Send response
    res.status(200).json({ message: 'Login successful', userId: user.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Function to handle onboarding for users
exports.onBoard = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const { experience, mentorshipStatus, jobDescription, mentorshipRate, calendarLink, linkedinLink, education, achievements } = req.body;
  
    // Update user profile based on role
    let updateFields = {
      profile: {
        skills: req.body.skills,
        linkedinLink: linkedinLink,
        achievements: achievements,
      }
    };
  
    if (user.role === 'student') {
      updateFields.profile.skills = req.body.skills;
  
    } else if (user.role === 'professional') {
      updateFields.profile.experience = experience;
      updateFields.profile.mentorshipStatus = mentorshipStatus;
      updateFields.profile.jobDescription = jobDescription;
      updateFields.profile.mentorshipRate = mentorshipRate;
      updateFields.profile.calendarLink = calendarLink;
      updateFields.profile.education = education;
  
    } else {
      updateFields.profile.experience = experience;
      updateFields.profile.jobDescription = jobDescription;
      updateFields.profile.education = education;
    }
  
    await User.updateOne({ email }, { $set: updateFields });
  
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
exports.follow = async(req,res) =>
{
  try {
    const { followedUserId } = req.query;
    const { followerUserId } = req.query;
    console.log(followedUserId)
    console.log(followerUserId)
  
    // Find the follower user
    const followerUser = await User.findOne({ userId: followerUserId });
    if (!followerUser) {
      return res.status(404).json({ error: 'Follower user not found' });
    }
  
    // Find the followed user
    const followedUser = await User.findOne({ userId: followedUserId });
    if (!followedUser) {
      return res.status(404).json({ error: 'Followed user not found' });
    }
  
    // Determine the roles of both users
    const followerUserRole = followerUser.role;
    const followedUserRole = followedUser.role;
  
    // Update follower/following lists based on user roles
    switch (followerUserRole) {
      case 'student':
        await User.updateOne({ userId: followedUserId }, { $addToSet: { 'profile.studentfollowers': followerUserId } });
        await User.updateOne({ userId: followerUserId }, { $addToSet: { 'profile.studentfollowing': followedUserId } });
        break;
      case 'professional':
        await User.updateOne({ userId: followedUserId }, { $addToSet: { 'profile.professionalfollowers': followerUserId } });
        await User.updateOne({ userId: followerUserId }, { $addToSet: { 'profile.professionalfollowing': followedUserId } });
        break;
      case 'recruiter':
        await User.updateOne({ userId: followedUserId }, { $addToSet: { 'profile.recruiterfollowers': followerUserId } });
        await User.updateOne({ userId: followerUserId }, { $addToSet: { 'profile.recruiterfollowing': followedUserId } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role' });
    }
  
    res.status(200).json({ message: 'Follow action completed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }  
}
exports.unfollow= async(req,res)=>
{
  try {
    const { followedUserId } = req.params;
    const { followerUserId } = req.query;

    // Find the follower user
    const followerUser = await User.findOne({ userId: followerUserId });
    if (!followerUser) {
      return res.status(404).json({ error: 'Follower user not found' });
    }

    // Find the followed user
    const followedUser = await User.findOne({ userId: followedUserId });
    if (!followedUser) {
      return res.status(404).json({ error: 'Followed user not found' });
    }

    // Determine the roles of both users
    const followerUserRole = followerUser.role;

    // Remove follower from followed user's followers list
    switch (followerUserRole) {
      case 'student':
        followedUser.profile.studentfollowers = followedUser.profile.studentfollowers.filter(id => id !== followerUserId);
        break;
      case 'professional':
        followedUser.profile.professionalfollowers = followedUser.profile.professionalfollowers.filter(id => id !== followerUserId);
        break;
      case 'recruiter':
        followedUser.profile.recruiterfollowers = followedUser.profile.recruiterfollowers.filter(id => id !== followerUserId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role' });
    }

    // Remove followed user from follower's following list
    followerUser.profile.studentfollowing = followerUser.profile.studentfollowing.filter(id => id !== followedUserId);
    followerUser.profile.professionalfollowing = followerUser.profile.professionalfollowing.filter(id => id !== followedUserId);
    followerUser.profile.recruiterfollowing = followerUser.profile.recruiterfollowing.filter(id => id !== followedUserId);

    // Save both users to update follower/following lists
    await Promise.all([followerUser.save(), followedUser.save()]);

    res.status(200).json({ message: 'Unfollow action completed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
exports.getById=async(req,res) =>
{
  try {
    const { userId } = req.query;

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
exports.search = async(req,res)=>
{
  try {
    const { name } = req.query;

    // Create a regex name with case-insensitive matching
    const regex = new RegExp(name, 'i');

    // Find users whose username matches the regex name
    const users = await User.find({ username: regex });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found matching the name' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
exports.getfollow=async(req,res)=>
{
  try {
    const {userId}=req.query;
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Extract followers and following from user's profile
    const { studentfollowers, professsionalfollowers, recruiterfollowers, studentfollowing, professionalfollowing, recruiterfollowing } = user.profile;

    // Combine all followers and following into one array
    const allFollowers = [...studentfollowers, ...professsionalfollowers, ...recruiterfollowers];
    const allFollowing = [...studentfollowing, ...professionalfollowing, ...recruiterfollowing];

    return res.status(200).json({ allFollowers, allFollowing });
  } catch (error) {
    console.error('Error retrieving followers and following:', error.message);
    return res.status(500).json("could not fetch followers following");
  }
}
exports.getmentors=async(req,res)=>
{
  try {
    // Find users with role 'professional' or 'recruiter' and mentorshipStatus true
    const qualifiedUsers = await User.find({
      $or: [{ role: 'professional' }, { role: 'recruiter' }]
    });

    return res.status(200).json(qualifiedUsers);
  } catch (error) {
    console.error('Error retrieving qualified users:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
exports.getmentorsByType=async(req,res)=>
{
  try {
    let { skills } = req.query; // Assuming skills is a string separated by commas

    // Split skills string into an array and create a regex pattern
    skills = skills.split(',').map(skill => skill.trim().replace(/[^a-zA-Z0-9]/g, '\\$&')).join('|');

    // Find qualified users (professionals and recruiters)
    const qualifiedUsers = await User.find({
      $or: [{ role: 'professional' }, { role: 'recruiter' }]
    });

    // Filter qualified users based on regex search against skills
    const regex = new RegExp(`(${skills})`, 'i');
    const mentorsBySkills = qualifiedUsers.filter(user =>
      user.profile.skills.some(skill => regex.test(skill))
    );

    return res.status(200).json(mentorsBySkills);
  } catch (error) {
    console.error('Error retrieving mentors by skills:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
exports.logout=async(req,res)=>
{
  try {
    const { userId } = req.query;
    // Find the user by userId and update the loggedIn field to false
    const result = await User.updateOne({ userId }, { $set: { loggedIn: false } });
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'User not found or already logged out' });
    }
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
exports.isloggedin=async(req,res)=>
{
  const { userId } = req.query;

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is logged in
    const isLoggedIn = user.loggedIn || false;

    return res.status(200).json({ isLoggedIn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}