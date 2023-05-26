const asyncHandler = (fn) => (req, res, next) =>
  Promise.reject(fn(req, res, next)).catch(next);
//   console.log('middleware', fn());

module.exports = asyncHandler;
