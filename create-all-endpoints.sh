#!/bin/bash

# Create users routes
cat > src/routes/users.js << 'EOF'
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
EOF

# Create users controller
cat > src/controllers/usersController.js << 'EOF'
const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email avatar');
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { preferences: user.preferences } });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { stats: user.stats } });
  } catch (error) {
    next(error);
  }
};
EOF

# Create routes routes
cat > src/routes/routes.js << 'EOF'
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const routesController = require('../controllers/routesController');

router.use(protect);

router.post('/', routesController.createRoute);
router.get('/', routesController.getRoutes);
router.get('/:id', routesController.getRoute);
router.put('/:id', routesController.updateRoute);
router.delete('/:id', routesController.deleteRoute);
router.post('/optimize', routesController.optimizeRoute);
router.post('/:id/share', routesController.shareRoute);

module.exports = router;
EOF

# Create routes controller
cat > src/controllers/routesController.js << 'EOF'
const Route = require('../models/Route');

exports.createRoute = async (req, res, next) => {
  try {
    const route = await Route.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { route } });
  } catch (error) {
    next(error);
  }
};

exports.getRoutes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, saved } = req.query;
    const query = { user: req.user._id };
    if (saved) query.isSaved = saved === 'true';
    
    const routes = await Route.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Route.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        routes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.json({ success: true, data: { route } });
  } catch (error) {
    next(error);
  }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.json({ success: true, data: { route } });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.json({ success: true, message: 'Route deleted' });
  } catch (error) {
    next(error);
  }
};

exports.optimizeRoute = async (req, res, next) => {
  try {
    // Route optimization logic (integrate with Mapbox Optimization API)
    res.json({ success: true, data: { optimizedRoute: req.body } });
  } catch (error) {
    next(error);
  }
};

exports.shareRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    // Share logic
    res.json({ success: true, message: 'Route shared successfully' });
  } catch (error) {
    next(error);
  }
};
EOF

# Create places routes
cat > src/routes/places.js << 'EOF'
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const placesController = require('../controllers/placesController');

router.get('/search', placesController.searchPlaces);
router.get('/nearby', placesController.getNearbyPlaces);
router.get('/:id', placesController.getPlace);
router.get('/:id/reviews', placesController.getPlaceReviews);
router.post('/:id/reviews', protect, placesController.addReview);
router.post('/:id/save', protect, placesController.savePlace);

module.exports = router;
EOF

# Create places controller
cat > src/controllers/placesController.js << 'EOF'
const Place = require('../models/Place');
const Review = require('../models/Review');

exports.searchPlaces = async (req, res, next) => {
  try {
    const { q, category, limit = 20 } = req.query;
    const query = {};
    
    if (q) {
      query.$text = { $search: q };
    }
    if (category) {
      query.category = category;
    }
    
    const places = await Place.find(query).limit(parseInt(limit));
    res.json({ success: true, data: { places } });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyPlaces = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5000, category } = req.query;
    
    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
    };
    
    if (category) query.category = category;
    
    const places = await Place.find(query).limit(50);
    res.json({ success: true, data: { places } });
  } catch (error) {
    next(error);
  }
};

exports.getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }
    res.json({ success: true, data: { place } });
  } catch (error) {
    next(error);
  }
};

exports.getPlaceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ place: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { reviews } });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const review = await Review.create({
      ...req.body,
      place: req.params.id,
      user: req.user._id
    });
    res.status(201).json({ success: true, data: { review } });
  } catch (error) {
    next(error);
  }
};

exports.savePlace = async (req, res, next) => {
  try {
    // Save place to user's favorites
    res.json({ success: true, message: 'Place saved successfully' });
  } catch (error) {
    next(error);
  }
};
EOF

# Create trips routes
cat > src/routes/trips.js << 'EOF'
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const tripsController = require('../controllers/tripsController');

router.use(protect);

router.post('/', tripsController.createTrip);
router.get('/', tripsController.getTrips);
router.get('/:id', tripsController.getTrip);
router.put('/:id', tripsController.updateTrip);
router.post('/:id/export', tripsController.exportTrip);

module.exports = router;
EOF

# Create trips controller
cat > src/controllers/tripsController.js << 'EOF'
const Trip = require('../models/Trip');

exports.createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

exports.getTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const trips = await Trip.find({ user: req.user._id })
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Trip.countDocuments({ user: req.user._id });
    
    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, data: { trip } });
  } catch (error) {
    next(error);
  }
};

exports.exportTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    // Export logic (PDF, CSV, GPX)
    res.json({ success: true, data: { exportUrl: '/exports/trip.pdf' } });
  } catch (error) {
    next(error);
  }
};
EOF

# Create social routes
cat > src/routes/social.js << 'EOF'
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
EOF

# Create social controller
cat > src/controllers/socialController.js << 'EOF'
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
EOF

# Create maps routes
cat > src/routes/maps.js << 'EOF'
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const mapsController = require('../controllers/mapsController');

router.use(protect);

router.get('/offline', mapsController.getOfflineMaps);
router.post('/offline/download', mapsController.downloadOfflineMap);
router.delete('/offline/:id', mapsController.deleteOfflineMap);

router.get('/safety-alerts', mapsController.getSafetyAlerts);
router.post('/safety-alerts', mapsController.reportSafetyAlert);

module.exports = router;
EOF

# Create maps controller
cat > src/controllers/mapsController.js << 'EOF'
const OfflineMap = require('../models/OfflineMap');
const SafetyAlert = require('../models/SafetyAlert');

exports.getOfflineMaps = async (req, res, next) => {
  try {
    const maps = await OfflineMap.find({ user: req.user._id });
    res.json({ success: true, data: { maps } });
  } catch (error) {
    next(error);
  }
};

exports.downloadOfflineMap = async (req, res, next) => {
  try {
    const map = await OfflineMap.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: { map } });
  } catch (error) {
    next(error);
  }
};

exports.deleteOfflineMap = async (req, res, next) => {
  try {
    await OfflineMap.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Offline map deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getSafetyAlerts = async (req, res, next) => {
  try {
    const { lng, lat, radius = 10000 } = req.query;
    
    const alerts = await SafetyAlert.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      },
      expired: false
    });
    
    res.json({ success: true, data: { alerts } });
  } catch (error) {
    next(error);
  }
};

exports.reportSafetyAlert = async (req, res, next) => {
  try {
    const alert = await SafetyAlert.create({ ...req.body, reportedBy: req.user._id });
    res.status(201).json({ success: true, data: { alert } });
  } catch (error) {
    next(error);
  }
};
EOF

echo "All endpoints created successfully!"
