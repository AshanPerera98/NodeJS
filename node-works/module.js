// console.log(arguments); // incoming argumnets
// console.log(require("module").wrapper); // wrapper funtion porvided by node

// module exports
const c = require("./test-module-1");
const calc1 = new c();
const resul1 = calc1.add(1, 2);

// exports
// const calc2 = require("./test-module-2");
const { add, multiply } = require("./test-module-2");
const resul2 = multiply(2, 4);

console.log(resul1, resul2);

// caching

require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
