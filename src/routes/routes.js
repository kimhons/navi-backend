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
