const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // set the path for config file iin dotenv

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listining to port ${port}`);
});
