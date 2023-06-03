const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geoCoder');

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamps = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      // return res.status(400).json({ success: false });
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    await bootcamp.deleteOne();
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

// @desc   Upload photo for bootcamp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    if (!req.files) {
      return next(new ErrorResponse(`please upload a file `, 400));
    }
    console.log(req.files);
    const file = req.files.file;
    // Make sure the image is file
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`please upload an Image File `, 400));
    }
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `please upload an Image less than ${process.env.MAX_FILE_UPLOAD} `,
          400
        )
      );
    }
    //Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log('first', file.name);
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return next(new ErrorResponse(`problem with file upload`, 500));
      }
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  } catch (error) {
    next(error);
  }
};
