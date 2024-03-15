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

    res.status(201).json({ message: 'User registered successfully' });
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
      user.profile.experience = experience;
      user.profile.mentorshipStatus = mentorshipStatus;
      user.profile.jobDescription = jobDescription;
      user.profile.mentorshipRate = mentorshipRate;
      user.profile.calendarLink = calendarLink;
      user.profile.linkedinLink = linkedinLink;

    } else {
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
