const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const ErrorController = require('./controllers/errorController');

const viewRouter = require('./routes/viewRouts');
const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');
const bookingRouter = require('./routes/bookingRouts');

const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy'); // enable proxy for heroku req forwarding

// initializing template engine for express (pug)
app.set('view engine', 'pug');
// setting views directory
app.set('views', path.join(__dirname, 'views'));

// enable CROS origin requests for all (*)
app.use(cors());

// enable CROS for only one origin
// app.use(
//   cors({
//     origin: 'https://www.forntend.com',
//   })
// );

// enable CROS for complex (PUT, PATCH, DELETE) req through options
app.options('*', cors());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLE WARE
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://cdnjs.cloudflare.com',
        'https://js.stripe.com',
      ],
      'frame-src': ["'self'", 'https://js.stripe.com'],
      // Other directives...
    },
  })
); // set secutiry headers for http

// Body parser: middleware to add the data from the request body to req in method. and limit the size to 10kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser()); // to get the cookies from incoming requests

// sanitize against NoSQL script injection
app.use(mongoSanitize());

// sanitize against Cross-site scripting
app.use(xss());

// compress text in responses
app.use(compression());

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

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }), // body parser is added to prevent the req body from turning into json
  bookingController.webhookCheckout
);

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

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// This middleware only runs of the path doesnt match any routers
// app.all() will take all get,post,put,delete methods
app.all('*', (req, res, next) => {
  // passing any argument to the next() function will automatically hit the error handling middleware
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

// When there are 4 arguments in a middleware express will automatically know that is a error handling middleware
app.use(ErrorController);

module.exports = app;
