const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // set the path for config file iin dotenv

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('🚫 Uncaught Exception | Shutting down...');
  process.exit(1); // exit the process after catching the unhandled rejection error with exit code 1
});

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
  console.log('🚫 Shutting down the server...');
  // shuttin down the server before exit
  server.close(() => {
    process.exit(1); // exit the process after catching the unhandled rejection error with exit code 1
  });
});

// handle SIGTERM shutdown from heroku
process.on('SIGTERM', () => {
  console.log('🚫 Shutting down the server from SIGTERM...');
  server.close(() => {
    console.log('Process terminated');
  });
});
