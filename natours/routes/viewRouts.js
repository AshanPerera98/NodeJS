const express = require('express');
const {
  getTour,
  getOverview,
  getLogin,
  getAccount,
  getMyTours,
} = require('./../controllers/viewController');
const { createBookingCheckout } = require('./../controllers/bookingController');
const { isLoggedIn, protect } = require('./../controllers/authController');

const router = express.Router();

// route for initial pug template
// router.get('/', (req, res) => {
//   res
//     .status(200)
//     .render('base', { tour: 'Sample Tour', description: 'sample description' }); // second object is used to pass variables into pug template (locals)
// });

// middleware to pass logged in user data to pug template
// router.use(isLoggedIn);

router.get('/', createBookingCheckout, isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLogin);

router.get('/me', protect, getAccount);

router.get('/my-tours', createBookingCheckout, protect, getMyTours);

module.exports = router;
