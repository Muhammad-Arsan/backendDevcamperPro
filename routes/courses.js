const express = require('express');
const {
  getCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const { protect, authorize } = require('../middleware/auth');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
);
router.get('/:id', getSingleCourse);
router.post('/', protect, authorize('publisher', 'admin'), addCourse);
router.put('/:id', protect, authorize('publisher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse);
module.exports = router;
