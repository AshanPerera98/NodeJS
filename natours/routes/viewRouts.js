const express = require('express');
const { getTour, getOverview } = require('./../controllers/viewController');

const router = express.Router();

// route for initial pug template
// router.get('/', (req, res) => {
//   res
//     .status(200)
//     .render('base', { tour: 'Sample Tour', description: 'sample description' }); // second object is used to pass variables into pug template (locals)
// });

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

module.exports = router;
