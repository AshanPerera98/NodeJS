const Review = require('./../models/reviewModel');

const factory = require('./handlerFactory');

// adding tour id from path params and user id from JWT token when used in nested route
exports.preProcessCreateReview = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.readAllDocumnets(Review);
exports.getReview = factory.readDocumnet(Review);
exports.createReview = factory.createDocument(Review);
exports.updateReview = factory.updateDocument(Review);
exports.deleteReview = factory.deleteDocument(Review);
