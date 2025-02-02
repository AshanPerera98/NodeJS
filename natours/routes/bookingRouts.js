const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // mergeParams will let the current router to access the parameters from other routers

// this will run the protected route as a middleware so only authenticated users can access every route after this
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

module.exports = router;
