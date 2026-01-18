// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware')
const redisClient = require('../utils/redisClient')
const{
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
}=require('../utils/tokenService');

//---------------------------------------registering user api--------------------------------------------------
// @route   POST /register
// @desc    Register a new user
// @access  Public
//api/auth/register
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { userId: user._id };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await redisClient.set(
      `refresh:${user._id}`,
      refreshToken,
      { EX: 7 * 24 * 60 * 60 }
    );

    res.json({ accessToken, refreshToken });
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


//--------------------------------------------------------------------------------------------------------------------
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token provided' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const redisKey = `refresh:${decoded.userId}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }

    // 🔁 ROTATION
    const newAccessToken = generateAccessToken({
      userId: decoded.userId
    });

    const newRefreshToken = generateRefreshToken({
      userId: decoded.userId
    });

    await redisClient.set(
      redisKey,
      newRefreshToken,
      { EX: 7 * 24 * 60 * 60 }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    console.error('❌ Refresh token error:', err);
    res.status(401).json({ msg: 'Invalid or expired refresh token' });
  }
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

//---------------------------------------redis--------------------------------
router.post('/logout', authMiddleware, async (req, res) => {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ msg: 'No token provided' });

  try {
    await redisClient.set(token, 'blacklisted', {
      EX: 60 * 60 // 1 hour TTL
    });

    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;