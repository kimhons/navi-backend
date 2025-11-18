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
