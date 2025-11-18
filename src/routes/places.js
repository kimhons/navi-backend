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
