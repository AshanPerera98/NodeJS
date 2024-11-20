const EventEmitter = require("events");
const http = require("http");

class customEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

// This is called observer pattern

const emitter = new customEmitter();

// observing
emitter.on("customEvent", () => {
  console.log("Custom event triggered");
});

// observing
emitter.on("customEvent", (params) => {
  console.log("With params", params);
});

// emitting
emitter.emit("customEvent", { name: "custom name" });

// --------------------------------------------------

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Incoming request");
  console.log(req.url);
  res.end("Request Success");
});

server.on("request", (req, res) => {
  console.log("Other incoming request *");
  console.log(req.url);
});

server.listen(8080, () => {
  console.log("Listning to requests...");
});
