const AppError = require('./../utils/appError');

// refactor the casting error for client
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// refactor the duplicate error for client
const handleDuplicateError = (err) => {
  let message = 'Duplicate values in following:';

  for (const [key, value] of Object.entries(err.keyValue)) {
    message = `${message} | '${value}' at '${key}'`;
  }
  return new AppError(message, 400);
};

// refactor the validation error for client
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  let message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Validation failed unothorized user', 401);

const handleJWTExpireError = (err) =>
  new AppError('Token expired please login again', 401);

const devError = (err, req, res) => {
  // error handling for the API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // error handling for the website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const prodError = (err, req, res) => {
  // error handling for the API
  if (req.originalUrl.startsWith('/api')) {
    // Operational: trusted known error where we want to sent client what is the error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error where we dont want to send the details to client
    } else {
      // logging the details of the error
      console.error('💥Unknown error occured!', err);

      // handling the error
      return res.status(500).json({
        status: 'ERROR',
        message: 'Something went wrong!',
      });
    }
  }

  // error handling for the website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'ERROR';

  if (process.env.NODE_ENV === 'development') {
    devError(err, req, res);
  } else {
    let error = { ...err };
    // checking if the error is a casting error and handle it
    if (error.name === 'CastError') error = handleCastError(error);
    // checking if the error is a duplicate error and handle it
    if (error.code === 11000) error = handleDuplicateError(error);
    // checking if the error is a validation error and handle it
    if (error.name === 'ValidationError') error = handleValidationError(error);
    // checking if the error is a JWT error and handle it
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    // checking if the error is a JWT expiration error and handle it
    if (error.name === 'JsonWebTokenError') error = handleJWTExpireError(error);
    prodError(error, req, res);
  }
};
