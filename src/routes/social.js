const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const socialController = require('../controllers/socialController');

router.use(protect);

router.get('/friends', socialController.getFriends);
router.post('/friends/request', socialController.sendFriendRequest);
router.post('/friends/accept/:id', socialController.acceptFriendRequest);
router.delete('/friends/:id', socialController.removeFriend);

router.get('/messages', socialController.getMessages);
router.post('/messages', socialController.sendMessage);

router.get('/groups', socialController.getGroups);
router.post('/groups', socialController.createGroup);

module.exports = router;
