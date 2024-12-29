const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'SUCCESS',
//     resutls: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// using factory to read all the documnet
exports.getAllReviews = factory.readAllDocumnets(Review);

// adding tour id from path params and user id from JWT token when used in nested route
exports.preProcessCreateReview = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// using factory to create the documnet
exports.createReview = factory.createDocument(Review);

// using factory to update the documnet
exports.updateReview = factory.updateDocument(Review);

// using factory to delete the documnet
exports.deleteReview = factory.deleteDocument(Review);

// using factory to read the documnet
exports.getReview = factory.readDocumnet(Review);
