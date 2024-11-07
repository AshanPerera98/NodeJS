const http = require("http");

const server = http.createServer((req, res) => {
  //   console.log(req);
  res.end("Hello World!");
});

server.listen("8080", "127.0.0.1", () => {
  console.log("Listning to port 8080");
});
