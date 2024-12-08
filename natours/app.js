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

module.exports = app;
