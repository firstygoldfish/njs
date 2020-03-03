var fs = require("fs");

/*fs.readFile("./offender.json","utf8", function (err,data) {
    if (err) {
        console.log("FAILED TO READ FILE");
    } else {
        offenderData = JSON.parse(data);
        console.log("offender.js:" + offenderData[0].keys[0]);
    }
});*/
var content = fs.readFileSync("./offender.json","utf8");

var offenderData = JSON.parse(content);

module.exports = offenderData;