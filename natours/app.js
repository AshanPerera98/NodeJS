const fs = require('fs');
const express = require('express');

const port = 3000;
const app = express();

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

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
