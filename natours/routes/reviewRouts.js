const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // mergeParams will let the current router to access the parameters from other routers

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.allow('user'),
    reviewController.preProcessCreateReview,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
