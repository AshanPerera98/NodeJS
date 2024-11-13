const http = require("http");
const url = require("url");
const fs = require("fs");

// import replace template module
const replaceTemp = require("./modules/replaceTemplate");

// This will read the data from the file once when the server starts so it can be read synchronusly
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // destructure the req object to get the pathname and query params
  const { pathname, query } = url.parse(req.url, true);

  switch (pathname) {
    // overview page
    case "/":
    case "/overview":
      // passing the template and data to be filled
      const cardsHtml = dataObj.map((e) => replaceTemp(tempCard, e)).join("");

      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      // send response with filled template
      res.end(tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml));
      break;

    // product page
    case "/product":
      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      // get the relevant product data from the dataObj and fill the template with data
      const product = dataObj[query.id];
      const output = replaceTemp(tempProduct, product);

      res.end(output);
      break;

    // API
    case "/api":
      // Below data read will execute every time a request is made to the endpoint so it needs to be async
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

    // Not found
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
