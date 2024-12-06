const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.validId = (req, res, next, val) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour)
    return res
      .status(404)
      .json({ status: 'FAIL', message: 'No tours found with this id' });

  res.tour = tour;

  next();
};

exports.validateTour = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'FAIL',
      message: 'Name and price cannot be empty',
    });

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    requestTime: req.requestTime,
    resutls: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tours: res.tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(500).send('Internal server error');
      res.status(201).json({
        status: 'SUCCESS',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const updatedTour = { ...res.tour, ...req.body };

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tours: updatedTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'SUCCESS',
    data: {
      tours: null,
    },
  });
};
