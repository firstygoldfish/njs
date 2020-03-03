var fs = require("fs");
var offenderData = require("./offender");

var i,j;
for (j=0; j< offenderData.length; j++) {
    for(i=0; i < offenderData[j].keys.length; i++)
    {
    console.log("Column : " + offenderData[j].keys[i] + " -+- Value : " + offenderData[j].values[i]);
    }
}

