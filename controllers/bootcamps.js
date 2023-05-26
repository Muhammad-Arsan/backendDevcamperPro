const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geoCoder');

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamps = async (req, res, next) => {
  try {
    let query;
    // Copy req.query

    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over remoceFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    console.log('request query', reqQuery);

    // Create query string

    let queryStr = JSON.stringify(reqQuery);
    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    //Findings resource
    query = Bootcamp.find(JSON.parse(queryStr));

    //Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      console.log('res', fields);
      query = query.select(fields);
      console.log('queryInner', query);
    }
    console.log('query', query);

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // executing query
    const bootcamps = await query;
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const data = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};

// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      // return res.status(400).json({ success: false });
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      // return res.status(400).json({ success: false });
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};

// @desc   Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // Get lat , lon from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calc radius using radians
    // Divide dist by radius of earth
    // Earth radius = 3963 mi / 6378 km

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};
