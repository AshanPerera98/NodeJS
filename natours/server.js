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

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('🚫 Shutting down the seerver...');
  // shuttin down the server before exit
  server.close(() => {
    process.exit(1); // exit the process after catching the unhandled rejection error with exit code 1
  });
});
