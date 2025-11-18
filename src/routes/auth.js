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
