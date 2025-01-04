const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const ErrorController = require('./controllers/errorController');

const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');

const app = express();

// initializing template engine for express (pug)
app.set('view engine', 'pug');
// setting views directory
app.set('views', path.join(__dirname, 'views'));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLE WARE
app.use(helmet()); // set secutiry headers for http

// Body parser: middleware to add the data from the request body to req in method. and limit the size to 10kb
app.use(express.json({ limit: '10kb' }));

// sanitize against NoSQL script injection
app.use(mongoSanitize());

// sanitize against Cross-site scripting
app.use(xss());

// protect against parameter polution
app.use(
  hpp({
    // whitelisted query params can have duplicates
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// third party middleware for logging only in dev mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// creating reate limiter
const limiter = rateLimit({
  // only 100 request per minute allowed from single IP address
  max: 100, // maximum number of requests
  windowMs: 60 * 1000, // time limit in ms
  message: 'Maximum request limit exeeded',
});

// setting rate limiter to "/api" route
app.use('/api', limiter);

// app.use((req, res, next) => {
//   console.log('This is a middle ware running');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// route for initial pug template
app.get('/', (req, res) => {
  res
    .status(200)
    .render('base', { tour: 'Sample Tour', description: 'sample description' }); // second object is used to pass variables into pug template (locals)
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// This middleware only runs of the path doesnt match any routers
// app.all() will take all get,post,put,delete methods
app.all('*', (req, res, next) => {
  // passing any argument to the next() function will automatically hit the error handling middleware
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

// When there are 4 arguments in a middleware express will automatically know that is a error handling middleware
app.use(ErrorController);

module.exports = app;
