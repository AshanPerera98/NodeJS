const http = require("http");
const url = require("url");
const fs = require("fs");

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

// function to fill the template with data
const replaceTemp = (template, product) => {
  let output = template;

  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  console.log(req.url);

  switch (req.url) {
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
      res.end(tempProduct);
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
