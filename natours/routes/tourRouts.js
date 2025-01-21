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
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.allow('admin', 'lead', 'guide'),
    tourController.getMonthlyPlan
  );

// route to get aall thetours within a given area
router
  .route('/tours-within/:distance/center/:center/unit/:unit')
  .get(tourController.getToursWithin);

// route to get distances for all tours
router.route('/distances/:location/unit/:unit').get(tourController.getDistance);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.allow('admin', 'lead'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.allow('admin', 'lead'),
    tourController.uploadImages,
    tourController.resizeImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.allow('admin', 'lead'),
    tourController.deleteTour
  );

module.exports = router;
