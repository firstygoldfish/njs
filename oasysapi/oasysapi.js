var fs = require("fs");
var offender = require("./offender");

console.log("DETAILS:" + offender);
console.log("HERE");
var  offs = [
{"keys" : [ "offender_id", "Gender" ], "values" : [ 12345, "M" ], "response" : [ "01-01-1987", "TEST" ] } ,
{"keys" : [ "offender_id", "Gender" ], "values" : [ 98765, "M" ], "response" : [ "01-01-1987", "TEST" ] } 
];

//{"request" : [ { "offender_id" : 98765 } ], "response" : [ {"DOB" : "02-02-1970"} ] }
//];
var i;
for(i=0; i < offs[0].keys.length; i++)
{
console.log("Column : " + offs[0].keys[i] + " -+- Value : " + offs[0].values[i]);
}
