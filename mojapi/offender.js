var fs = require("fs");

var content = fs.readFileSync("./offender.json","utf8");

var offenderData = JSON.parse(content);

module.exports = offenderData;