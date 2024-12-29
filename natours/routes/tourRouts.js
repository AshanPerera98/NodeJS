const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const reviewRouter = require('./../routes/reviewRouts');

const router = express.Router();

// Router for creating reviews for tour (plugin in the review router as a middleware)
router.use('/:tourId/reviews', reviewRouter);

// Alias : special route to get top 5 tours
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.allow('admin', 'lead'),
    tourController.deleteTour
  );

module.exports = router;
