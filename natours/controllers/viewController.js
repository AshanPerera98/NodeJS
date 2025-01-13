const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getTour = catchAsync(async (req, res, next) => {
  // Get the data for the tour (including guides and reviews)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    feilds: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with given name', 404));
  }

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
