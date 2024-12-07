const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // set the path for config file iin dotenv

const app = require('./app');

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is mandetory in tour'],
    unique: true,
  },
  rating: { type: Number, default: 1.0 },
  price: { type: Number, required: [true, 'Price is mandetory in tour'] },
});
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'Test tour from mongoose',
  rating: 4.7,
  price: 13.99,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error(err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
