const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc   Get Reviews
// @route  GET /api/v1/reviews
// @route  GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReviews = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get Single Review
// @route  GET /api/v1/reviews/:id
// @access Public

exports.getSingleReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "bootcamp",
      select: "name description",
    });
    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Add Review
// @route  POST /api/v1/bootcamp/:bootcampId/reviews
// @access Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }
    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update Review
// @route  PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete Review
// @route  DELETE /api/v1/reviews/:id
// @access Private
exports.deleteReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    await review.deleteOne();
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
