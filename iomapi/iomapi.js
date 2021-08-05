var http = require('http'),
    fs = require('fs');

var port = 8080;
var ip = "127.0.0.1";
var jsonfile = 'iomdata.json';
/*-----------------------------DEFAULT STUFF---------------------------------*/
var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';
var bad = '{"status":"badrequest"}';
function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}
function loadJSON(filename = '') {
	return JSON.parse(
		fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile()
	);
}
/*--------------------------ENDPOINT FUNCTIONS-------------------------------*/
function displayRegistrations(res, crn) {
	var found = 0;
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			res.write(JSON.stringify(offdata.crn[i].registrations));
		}
	}
	if (found == 0) res.write(notfound);
}
/*----------------------------------ENDPOINTS--------------------------------*/
// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	crn: function(res,parts){
		var crn=parts[4];
		var func=parts[5];
		if (crn != undefined && func == "registrations") {
		  displayRegistrations(res, crn);
		} else {
		  res.write(bad);
		}
	}
}
/*------------------------------------SERVER---------------------------------*/
var offdata = loadJSON(jsonfile);
http.createServer(function(req, res) {	//Example request /secure/offenders/crn/23456/registrations
	var parts = req.url.split("/");
	//Get the endpoint
	var endpoint = endpoints[parts[3]];
	res.writeHead(200, {'Content-Type': 'text/plain'});
	//Call the endpoint
	endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
	res.end('');
}).listen(port, ip);
console.log("Server running at http://"+ip+":"+port);
