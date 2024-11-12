const http = require("http");
const url = require("url");
const fs = require("fs");

// This will read the data from the file once when the server starts so it can be read synchronusly
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.stringify({ data });

const server = http.createServer((req, res) => {
  console.log(req.url);

  switch (req.url) {
    case "/":
      res.end("overview");
      break;

    case "/overview":
      res.end("overview");
      break;

    case "/product":
      res.end("product");
      break;

    case "/api":
      // Below data read will execute every time a request is made to the endpoint so it needs to be async
      //
      // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      //   const dataObj = JSON.stringify({ data });

      //   res.writeHead(200, {
      //     "Content-Type": "application/json",
      //   });
      //   res.end(dataObj);
      // });

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(dataObj);
      break;

    default:
      res.writeHead(404, {
        "content-type": "text/html",
      });
      res.end("<h1>404</h1><h5>Page not found!</h5>");
  }

  //   res.end("Hello World!");
});

server.listen("8080", "127.0.0.1", () => {
  console.log("Listning to port 8080");
});
