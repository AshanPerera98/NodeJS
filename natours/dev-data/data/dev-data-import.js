const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.error(err);
  }
};

const insertData = async () => {
  try {
    const result = await Tour.create(tours);
    console.log(`Tours created`);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv.includes('--import')) {
  insertData();
} else if (process.argv.includes('--clear')) {
  deleteData();
}

console.log(process.argv);
