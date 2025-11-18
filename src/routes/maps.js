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
