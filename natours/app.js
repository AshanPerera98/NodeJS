const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');

const app = express();

// MIDDLE WARE
app.use(express.json()); // middleware to add the data from the request body to req in method.
if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // third party middleware for logging only in dev mode
app.use(express.static(`${__dirname}/public`)); // serve static files

// app.use((req, res, next) => {
//   console.log('This is a middle ware running');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// This middleware only runs of the path doesnt match any routers
// app.all() will take all get,post,put,delete methods
app.all('*', (req, res, next) => {
  const err = new Error(`Can not find ${req.originalUrl}`);
  err.status = 'FAIL';
  err.statusCode = 404;

  // passing any argument to the next() function will automatically hit the error handling middleware
  next(err);
});

// When there are 4 arguments in a middleware express will automatically know that is a error handling middleware
app.use((err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || 'ERROR');

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
