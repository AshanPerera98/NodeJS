const fs = require("fs");
const superagent = require("superagent");

// Create a new funtion that return promise when reading file
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Create a new funtion that return promise when writing file
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      resolve("Write success");
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`)
  .then((result) => {
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((res) => {
    console.log(res.body);
    return writeFilePromise("./dog-image.txt", res.body.message);
  })
  .then(() => {
    console.log("Image file saved");
  })
  .catch((err) => {
    console.error(err);
  });
