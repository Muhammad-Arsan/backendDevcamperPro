const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc   Get Courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get Single Courses
// @route  GET /api/v1/courses/:id
// @access Public

exports.getSingleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!course) {
      return next(
        new ErrorResponse(`No course with the ${req.params.id} Exists.`),
        404
      );
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc   Add a Course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No Bootcamp find with the id of ${req.params.bootcampId}`
        ),
        404
      );
    }

    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a Course
// @route  PUT /api/v1/courses/:id
// @access Private

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return next(
        new ErrorResponse(`Course not found with id of ${req.params.id}`),
        404
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a Course
// @route  PUT /api/v1/courses/:id
// @access Private

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
    await course.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
