const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // mergeParams will let the current router to access the parameters from other routers

// this will run the protected route as a middleware so only authenticated users can access every route after this
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.allow('user'),
    reviewController.preProcessCreateReview,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.allow('admin', 'user'), reviewController.updateReview)
  .delete(authController.allow('admin', 'user'), reviewController.deleteReview);

module.exports = router;
