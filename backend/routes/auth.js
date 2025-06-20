// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware=require('../middleware/authMiddleware')


//---------------------------------------registering user api--------------------------------------------------
// @route   POST /register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Save user to DB
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



//-------------------------------------------login api-------------------------------------------------------

// @route   POST /login
// @desc    Authenticate user and return token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create payload
    const payload = { userId: user._id };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


//----------------------------------------------------------------------------------------------------------------------
// @route   GET /protected
// @desc    A protected route
// @access  Private
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ msg: `Welcome, ${req.user.userId}! This is a protected route.` });
});


//---------------------------------------fetch all users------------------------------------
router.get('/get-members', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json({ members: users });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

//---------------------------------------delete user-------------------------------
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('🗑️ Attempting to delete user ID:', userId);

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.log('❌ No user found with ID:', userId);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('✅ Deleted user:', deletedUser.email);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;