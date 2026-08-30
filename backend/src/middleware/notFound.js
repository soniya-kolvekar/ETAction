const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  error.code = 'NOT_FOUND';
  next(error);
};

module.exports = notFound;
