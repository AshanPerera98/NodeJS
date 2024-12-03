const fs = require('fs');
const express = require('express');

const port = 3000;
const app = express();
app.use(express.json()); // middleware to add the data from the request body to req in method.

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/', (req, res) => {
  res.status(200).send('Hollo from the server');
});

app.get('/json', (req, res) => {
  res.status(200).json({ title: 'JSON', message: 'This is a JSON object' });
});

app.post('/json', (req, res) => {
  res.status(200).send('This is POST endpoint');
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'SUCCESS',
    resutls: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour)
    return res
      .status(404)
      .json({ status: 'FAIL', message: 'No tours found with this id' });

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      tours: 'This should be the updated tour',
    },
  });
});

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
