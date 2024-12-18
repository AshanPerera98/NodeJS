class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'FAIL' : 'ERROR';
    this.isOperational = true;

    // below line will remove the constructor method from the error stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
