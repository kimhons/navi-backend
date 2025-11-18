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
