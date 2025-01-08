const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getTour = (req, res) => {
  res.status(200).render('tour', { title: 'All Tours' });
};

exports.getOverview = catchAsync(async (req, res) => {
  // get tour data from DB
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});
