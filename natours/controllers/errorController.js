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

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err, res) => {
  // Operational: trusted known error where we want to sent client what is the error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error where we dont want to send the details to client
  } else {
    // logging the details of the error
    console.error('💥Unknown error occured!', err);

    // handling the error
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || 'ERROR');

  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else {
    let error = { ...err };
    // checking if the error is a casting error and handle it
    if (error.name === 'CastError') error = handleCastError(error);
    // checking if the error is a duplicate error and handle it
    if (error.code === 11000) error = handleDuplicateError(error);
    // checking if the error is a validation error and handle it
    if (error.name === 'ValidationError') error = handleValidationError(error);
    prodError(error, res);
  }
};
