const fs = require('fs');
const express = require('express');

const port = 3000;
const app = express();
app.use(express.json()); // middleware to add the data from the request body to req in method.

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
