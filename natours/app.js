const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const port = 3000;
const app = express();

// MIDDLE WARE
app.use(express.json()); // middleware to add the data from the request body to req in method.
app.use(morgan('dev')); // third party middleware

app.use((req, res, next) => {
  console.log('This is a middle ware running');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    requestTime: req.requestTime,
    resutls: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour)
    return res
      .status(404)
      .json({ status: 'FAIL', message: 'No tours found with this id' });

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tours: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour)
    return res
      .status(404)
      .json({ status: 'FAIL', message: 'No tours found with this id' });

  const updatedTour = { ...tour, ...req.body };

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tours: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour)
    return res
      .status(404)
      .json({ status: 'FAIL', message: 'No tours found with this id' });

  res.status(204).json({
    status: 'SUCCESS',
    data: {
      tours: null,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

// ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//   STARTING SERVER
app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
