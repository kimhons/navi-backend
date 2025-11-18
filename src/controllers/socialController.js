const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Message = require('../models/Message');
const Group = require('../models/Group');

exports.getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email avatar');
    res.json({ success: true, data: { friends: user.friends } });
  } catch (error) {
    next(error);
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { to } = req.body;
    const request = await FriendRequest.create({ from: req.user._id, to });
    res.status(201).json({ success: true, data: { request } });
  } catch (error) {
    next(error);
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    
    // Add to friends list
    await User.findByIdAndUpdate(request.from, { $push: { friends: request.to } });
    await User.findByIdAndUpdate(request.to, { $push: { friends: request.from } });
    
    res.json({ success: true, data: { request } });
  } catch (error) {
    next(error);
  }
};

exports.removeFriend = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { friends: req.user._id } });
    res.json({ success: true, message: 'Friend removed' });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    }).populate('sender recipient', 'name avatar').sort({ createdAt: -1 });
    
    res.json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create({ ...req.body, sender: req.user._id });
    res.status(201).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ 'members.user': req.user._id });
    res.json({ success: true, data: { groups } });
  } catch (error) {
    next(error);
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    const group = await Group.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });
    res.status(201).json({ success: true, data: { group } });
  } catch (error) {
    next(error);
  }
};
