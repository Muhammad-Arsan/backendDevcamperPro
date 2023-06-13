const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc   Get all Users
// @route  GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

// @desc   Get Single User
// @route  GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc   Create User
// @route  POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update User
// @route  PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete User
// @route  Delete /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
