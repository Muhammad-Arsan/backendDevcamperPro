const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect Routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // token from header
      token = req.headers.authorization.split(" ")[1];
    }

    //token from cookie

    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // make sure token exists

    if (!token) {
      return next(new ErrorResponse("No authorize to access this route", 401));
    }
    try {
      //Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return next(new ErrorResponse("No authorize to access this route", 401));
    }
  } catch (error) {}
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
