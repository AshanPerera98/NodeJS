const fs = require("fs");

// Blocking synchronus way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about avacado "${textIn}.\nCreated on ${Date.now()}"`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File created sccuess!");

// ---------------------------------------

// Non-blocking asynchronus way
fs.readFile("./txt/start.txt", "utf-8", (err1, data1) => {
  if (err1) return console.error("Error reading start.txt");

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err2, data2) => {
    if (err2) return console.error(`Error reading ${data1}.txt`);

    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err3, data3) => {
      if (err3) return console.error("Error reading append.txt");

      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}. ${data3}`, "utf-8", (err) => {
        err ? console.error(err) : console.log("File written success!");
      });
    });
  });
});
console.log("Reading file...");
