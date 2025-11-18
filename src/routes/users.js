const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const usersController = require('../controllers/usersController');

router.use(protect); // All user routes require authentication

router.get('/profile', usersController.getProfile);
router.put('/profile', usersController.updateProfile);
router.put('/preferences', usersController.updatePreferences);
router.get('/stats', usersController.getStats);

module.exports = router;
