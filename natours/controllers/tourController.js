const Tour = require('./../models/tourModel');
const APIBuilder = require('./../utils/apiBuilder');

// Alias middleware to set the expected query to the requestF
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // set result timit to 5
  req.query.sort = '-ratingsAverage,price'; // sort by most rated and cheapest
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // fields expected in the response

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Executing builder class to create the query object
    const builder = new APIBuilder(Tour.find(), req.query)
      .filtering()
      .sorting()
      .limiting()
      .paginating();
    const tours = await builder.query;

    res.status(200).json({
      status: 'SUCCESS',
      requestTime: req.requestTime,
      resutls: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'SUCCESS',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'SUCCESS',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'SUCCESS',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};
