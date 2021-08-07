var http = require('http'),
	url = require("url"),
    fs = require('fs');

/*--------------------------------CONFIGURATION-------------------------------*/
var port = 8080;
var ip = "127.0.0.1";
var jsonfile = 'iomdata.json';
var newcrnfile = 'newcrndata.json';
var newiomcrnfile = 'newiomcrndata.json';
/*--------------------------DO NOT CHANGE BELOW HERE--------------------------*/

/*---------------------------------VARIABLES----------------------------------*/
var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';
var bad = '{"status":"badrequest"}';
var endpoint = '';
/*-----------------------------CORE FUNCTIONS---------------------------------*/
function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}
function loadJSON(filename = '') {
	return JSON.parse(
		fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile()
	);
}
function securityHeader(req){
	var secHeader = req.headers['authorization'];
	if (secHeader != undefined && secHeader.substring(0,7) == "Bearer "){
		return true;
	} else {
		return false;
	}
}
/*--------------------------ENDPOINT FUNCTIONS-------------------------------*/
function listRegistrations(res) {
	res.write('<table><tr><th>CRN</th><th>Registrations</th></tr>')
	for (var i=0; i < offdata.crn.length; i++){
		res.write('<tr><td valign="top"  style="border: 1px solid black;">'+offdata.crn[i].crn+'</td><td  style="border: 1px solid black;"><pre>'+JSON.stringify(offdata.crn[i].registrations, null, 4)+'</pre></td></tr>');
	}
	res.write('</table>');
}
function displayRegistrations(res, crn) {
	var found = 0;
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			res.write(JSON.stringify(offdata.crn[i].registrations, null, 4));
		}
	}
	if (found == 0) res.write(notfound);
}
function addRegistration(res, crn, iom) {
	var found = 0;
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			res.write('CRN Already EXISTS');
		}
	}
	if (found == 0) {
		if (iom) {
			var newiomdata = loadJSON(newiomcrnfile); // Add IOM CRN	
		} else {
			var newiomdata = loadJSON(newcrnfile);    // Add NON IOM CRN
		}

		newiomdata.crn = crn;
		offdata.crn.push(newiomdata);
		fs.writeFile('testdata.json', JSON.stringify(offdata, null, 4), (err) => {
		    if (err) {
		        throw err;
		    }
		    console.log("JSON data is saved.");
		});
		displayRegistrations(res, crn);
	} 
}
/*----------------------------------ENDPOINTS--------------------------------*/
// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	list: function(res,parts){
		listRegistrations(res);
	},
	addiom: function(res,parts){
		var crn=parts[2];
		if (crn != undefined) {
		  addRegistration(res, crn, true);
		} else {
		  res.write(bad);
		}
	},
	addnoniom: function(res,parts){
		var crn=parts[2];
		if (crn != undefined) {
		  addRegistration(res, crn, false);
		} else {
		  res.write(bad);
		}
	},
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
	if (parts[1] == 'addiom') {
		endpoint = endpoints[parts[1]];
	} else if (parts[1] == 'addnoniom') {
		endpoint = endpoints[parts[1]];
	} else if (parts[1] == 'list') {
		endpoint = endpoints[parts[1]];
	} else {
		endpoint = endpoints[parts[3]];
	}
	//Do security check
	if (parts[1] == 'list') {
		//Call the endpoint
		endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
	} else if (securityHeader(req) == true) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		//Call the endpoint
		endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
	} else {
		res.writeHead(401, 'missing authorization header');
	}
	res.end('');
}).listen(port, ip);
console.log("Server running at http://"+ip+":"+port);