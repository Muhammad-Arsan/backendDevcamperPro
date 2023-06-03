const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  getAllBootcamps,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// include other resource routers
const courseRouter = require('./courses');

// re-route into other resource routers : start here
router.use('/:bootcampId/courses', courseRouter);
//end here

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);
router.get('/', advancedResults(Bootcamp, 'courses'), getAllBootcamps);
router.get('/:id', getBootcamp);
router.post('/', protect, authorize('publisher', 'admin'), createBootcamp);
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteBootcamp);
router.put(
  '/:id/photo',
  protect,
  authorize('publisher', 'admin'),
  bootcampPhotoUpload
);

module.exports = router;
