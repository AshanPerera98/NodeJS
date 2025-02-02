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

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'My account' });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
