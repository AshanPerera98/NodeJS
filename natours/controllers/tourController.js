const Tour = require('./../models/tourModel');

// Alias middleware to set the expected query to the requestF
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // set result timit to 5
  req.query.sort = '-ratingsAverage,price'; // sort by most rated and cheapest
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // fields expected in the response

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const { page, sort, limit, fields, ...queryParams } = req.query; // req.query is query strings (query object)

    // Advance filtering : adding $ infornt of every operator
    const queryString = JSON.stringify(queryParams).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryString));

    // Sorting
    if (sort) {
      query.sort(sort.split(',').join(' ')); // adding multiple sorting to gether with [space]
    } else {
      query.sort('-createdAt'); // default sorting
    }

    // Field limiting
    if (fields) {
      query.select(fields.split(',').join(' ')); // selecting only requested fields
    } else {
      query.select('-__v'); // excluding fields by default
    }

    // Pagination
    if (page || limit) {
      const pageVal = Number(page) || 1;
      const limitVal = Number(limit) || 50;
      const skip = (pageVal - 1) * limitVal;

      const numTours = await Tour.countDocuments();
      if (skip >= numTours)
        throw new Error('Page you requested does not exist');

      query.skip(skip).limit(limitVal); // query for pagination and result limit
    }

    const tours = await query;

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
