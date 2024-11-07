const http = require("http");
const url = require("url");

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
