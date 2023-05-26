const express = require('express');
const router = express.Router();
const {
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  getAllBootcamps,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);
router.get('/', getAllBootcamps);
router.get('/:id', getBootcamp);
router.post('/', createBootcamp);
router.put('/:id', updateBootcamp);
router.delete('/:id', deleteBootcamp);

module.exports = router;
