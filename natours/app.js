const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hollo from the server');
});

app.get('/json', (req, res) => {
  res.status(200).json({ title: 'JSON', message: 'This is a JSON object' });
});

app.post('/json', (req, res) => {
  res.status(200).send('This is POST endpoint');
});

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
