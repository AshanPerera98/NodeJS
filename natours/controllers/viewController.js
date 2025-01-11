const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getTour = catchAsync(async (req, res, next) => {
  // Get the data for the tour (including guides and reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    feilds: 'review rating user',
  });

  res.status(200).render('tour', { title: tour.title, tour });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from DB
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', { title: 'Login' });
};
