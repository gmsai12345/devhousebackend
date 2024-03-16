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
      coins: 0 // Assuming coins start from 0
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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

    const { experience, mentorshipStatus, jobDescription, mentorshipRate, calendarLink,linkedinLink } = req.body;

    // Update user profile based on role
    if (user.role === 'student') {
      const skills = req.body.skills;
      user.profile.skills= skills;
      user.profile.linkedinLink = linkedinLink;
    } else if (user.role === 'professional') {
      user.profile.skills = req.body.skills;
      user.profile.experience = experience;
      user.profile.mentorshipStatus = mentorshipStatus;
      user.profile.jobDescription = jobDescription;
      user.profile.mentorshipRate = mentorshipRate;
      user.profile.calendarLink = calendarLink;
      user.profile.linkedinLink = linkedinLink;

    } else {
      user.profile.skills = req.body.skills;
      user.profile.experience = experience;
      user.profile.jobDescription = jobDescription;
      user.profile.linkedinLink = linkedinLink;
    }

    await user.save();

    res.status(200).json({ message: 'User profile updated successfully', user });
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
        followedUser.profile.studentfollowers.push(followerUserId);
        followerUser.profile.studentfollowing.push(followedUserId);
        break;
      case 'professional':
        followedUser.profile.professionalfollowers.push(followerUserId);
        followerUser.profile.professionalfollowing.push(followedUserId);
        break;
      case 'recruiter':
        followedUser.profile.recruiterfollowers.push(followerUserId);
        followerUser.profile.recruiterfollowing.push(followedUserId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role' });
    }

    // Save both users to update follower/following lists
    await Promise.all([followerUser.save(), followedUser.save()]);

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
