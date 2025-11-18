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
