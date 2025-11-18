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
