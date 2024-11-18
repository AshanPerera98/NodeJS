const fs = require("fs");
const crypto = require("crypto");

// Thread count in the thread pool
process.env.UV_THREADPOOL_SIZE = 2;

const start = Date.now();

setTimeout(() => console.log("Timeout 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("./test-file.txt", () => {
  console.log("I/O finished");

  setTimeout(() => console.log("Timeout 2 finished"), 0);
  setTimeout(() => console.log("Timeout 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("nextTick finished"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
});

console.log("Top level code finished");
