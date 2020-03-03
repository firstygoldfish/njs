var fs = require("fs");

var ipfile = fs.readFileSync("./offender.json","utf8"); //,"utf8"

module.exports = ipfile;