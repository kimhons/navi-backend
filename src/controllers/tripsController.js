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
