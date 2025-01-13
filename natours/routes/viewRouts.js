const express = require('express');
const {
  getTour,
  getOverview,
  getLogin,
  getAccount,
} = require('./../controllers/viewController');
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

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLogin);

router.get('/me', protect, getAccount);

module.exports = router;
