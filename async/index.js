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

// async await
const dogImage = async () => {
  try {
    const result = await readFilePromise(`${__dirname}/dog.txt`);

    // waiting for multiple promises
    const res1Promise = await superagent.get(
      `https://dog.ceo/api/breed/${result}/images/random`
    );
    const res2Promise = await superagent.get(
      `https://dog.ceo/api/breed/${result}/images/random`
    );
    const res3Promise = await superagent.get(
      `https://dog.ceo/api/breed/${result}/images/random`
    );

    // resolve all promises
    const allPromises = await Promise.all([
      res1Promise,
      res2Promise,
      res3Promise,
    ]);

    // converting results
    const imageArr = allPromises.map((el) => el.body.message);

    await writeFilePromise("./dog-image.txt", imageArr.join("\n"));
    console.log("Image file saved");
  } catch (err) {
    console.error(err);
    throw err;
  }
  return "This is the returning value from the async function";
};

// using then to call the async function
// this is a funtion declaration which will trigger immediately after
(async () => {
  try {
    console.log("Before async function");
    const x = await dogImage();
    console.log(x);
    console.log("After async function");
  } catch (e) {
    console.error("This is the eeror from the async function :", err);
  }
})();

// using then to call the async function
/*
console.log("Before async function");
dogImage()
  .then((x) => {
    console.log(x);
    console.log("After async function");
  })
  .catch((err) => {
    console.error("This is the eeror from the async function :", err);
  });
*/

// promise and then
/*
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
*/
