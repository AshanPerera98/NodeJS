const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1: read the full file at once
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.error(err);
  //     res.end(data);
  //   });

  //   Sokution 2: read as chunk and stream
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("error", (err) => {
  //     console.error(err);
  //     res.statusCode = 500;
  //     res.end("Something went wrong");
  //   });
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     res.end();
  //   });

  //   Solution 3: readable stream piped into writable destination
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});

server.listen(8080, () => {
  console.log("Listning to port 8080");
});
