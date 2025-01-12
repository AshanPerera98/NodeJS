const express = require('express');
const {
  getTour,
  getOverview,
  getLogin,
} = require('./../controllers/viewController');
const { isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

// route for initial pug template
// router.get('/', (req, res) => {
//   res
//     .status(200)
//     .render('base', { tour: 'Sample Tour', description: 'sample description' }); // second object is used to pass variables into pug template (locals)
// });

// middleware to pass logged in user data to pug template
router.use(isLoggedIn);

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/login', getLogin);

module.exports = router;
