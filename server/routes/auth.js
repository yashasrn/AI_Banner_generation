const express = require('express');
const router = express.Router();
const argon2 = require('argon2'); // Ensure you have argon2 installed
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password (trim any spaces in the entered password)
    const hashedPassword = await argon2.hash(password.trim());
    console.log('Hashed Password on Signup:', hashedPassword); // Debugging log

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    console.log('Signup Data:', req.body);
    await newUser.save();

    // Respond to the client after successful signup
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received Login Data:', req.body); // Log incoming data

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log('Found User:', user); // Debugging log
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    // Log the entered password for comparison
    console.log('User Entered Password:', password.trim());

    // Compare the entered password with the stored hashed password
    const isMatch = await argon2.verify(user.password, password.trim());
    console.log('Password Match:', isMatch); // Log the result

    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    // Successful login
    res.status(200).json({ msg: 'Login successful', user, redirect: '/dashboard' });
  } catch (err) {
    console.error('Error during login:', err); // Log any errors
    res.status(500).send('Server Error');
  }
});

module.exports = router;
