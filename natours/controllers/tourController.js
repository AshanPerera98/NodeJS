const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

// Alias middleware to set the expected query to the requestF
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // set result timit to 5
  req.query.sort = '-ratingsAverage,price'; // sort by most rated and cheapest
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // fields expected in the response

  next();
};

exports.getAllTours = factory.readAllDocumnets(Tour);
exports.getTour = factory.readDocumnet(Tour, { path: 'reviews' });
exports.createTour = factory.createDocument(Tour);
exports.updateTour = factory.updateDocument(Tour);
exports.deleteTour = factory.deleteDocument(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }, // filter data to get only above 4.5 rating
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // group by difficulty
        numTours: { $sum: 1 }, // counting upwards
        numRating: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1, // sort in asc order avgPrice
      },
    },
  ]);

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startingDates', // $unwind will create a new record for every item in the given feild array ($startingDates)
    },
    {
      // date filteration to get the data only within given year
      $match: {
        startingDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      // group by the month and take the count
      $group: {
        _id: { $month: '$startingDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }, // putting all the tour names into array
      },
    },
    {
      // add a new field month with _id as value
      $addFields: { month: '$_id' },
    },
    {
      // remove _id field from the results
      $project: {
        _id: 0,
      },
    },
    {
      // sort in des order with number of tours
      $sort: {
        numTours: -1,
      },
    },
    {
      // limit the results to 3
      $limit: 3,
    },
  ]);

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      plan,
    },
  });
});

// controller to get all the tours within a given area
// /tours-within/400/center/34.11,-118.11/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, center, unit } = req.params;
  const [lat, lng] = center.split(',');

  // distance has to be devided by the radius of the earth to convert to mongoDB unit
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Latitude ang longitude is not available or not in the correct format',
        400
      )
    );
  }

  // query for all the points inside the sphere
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'SUCCESS',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
