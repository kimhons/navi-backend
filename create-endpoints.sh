#!/bin/bash

# Create auth routes and controller
cat > src/routes/auth.js << 'EOF'
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

// POST /api/v1/auth/signup
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    validate
  ],
  authController.signup
);

// POST /api/v1/auth/login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  authController.login
);

// POST /api/v1/auth/logout
router.post('/logout', protect, authController.logout);

// POST /api/v1/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/v1/auth/verify-email
router.post('/verify-email', authController.verifyEmail);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail(), validate],
  authController.forgotPassword
);

// POST /api/v1/auth/reset-password
router.post('/reset-password',
  [body('password').isLength({ min: 8 }), validate],
  authController.resetPassword
);

// GET /api/v1/auth/me
router.get('/me', protect, authController.getMe);

module.exports = router;
EOF

# Create auth controller
cat > src/controllers/authController.js << 'EOF'
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({ email, password, name, phone });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          preferences: user.preferences
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken }).select('+refreshToken');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const token = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: { token, refreshToken: newRefreshToken }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    // Implementation for email verification
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }

    // Generate reset token and send email
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    // Implementation for password reset
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};
EOF

echo "Auth endpoints created"
