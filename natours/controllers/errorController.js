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
    prodError(err, res);
  }
};
