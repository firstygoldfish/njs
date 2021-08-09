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
/*----------------------------------------------------------------------------*/
/*----------------------------CORE VARIABLES----------------------------------*/
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
function saveJSON() {
	fs.writeFile(jsonfile, JSON.stringify(offdata, null, 4), (err) => {
	    if (err) {
	        throw err;
	    }
	});
}
function securityHeader(req){
	var secHeader = req.headers['authorization'];
	if (secHeader !== undefined && secHeader.substring(0,7) == "Bearer "){
		return true;
	} else {
		return false;
	}
}
/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
function listRegistrations(res) {
	res.write('<table style="border-spacing:1px;"><tr><th style="color:#f4e7d0;background-color:#5571B4;padding:10px;">CRN</th><th style="color:#f4e7d0;background-color:#5571B4;padding:10px;">Registrations</th></tr>')
	for (var i=0; i < offdata.crn.length; i++){
		if ((i+1)%2 === 0) bgcol = 'B0BDDC'; //Odd colour
		if ((i+1)%2 !== 0) bgcol = 'DCCFB0'; //Even colour
		res.write('<tr><td style="background-color:#'+bgcol+';padding:5px;vertical-align:top;"><b>'+offdata.crn[i].crn+'</b>');
		res.write('<br/><input type="button" value="Edit" onclick="javascript:window.location = \'/edit/'+offdata.crn[i].crn+'\'"></td><td style="background-color: #'+bgcol+';padding:5px">');
		res.write('<pre>'+JSON.stringify(offdata.crn[i].registrations, null, 4)+'</pre></td></tr>');
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
	if (found === 0) res.write(notfound);
}
function edit(res, crn, req) {
	var found = 0;
	var foundindex = 0;
	var registrations = '';
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			foundindex = i;
			registrations = offdata.crn[i].registrations;
		}
	}
	if (found === 0) {
		res.write(notfound+',{crn:'+crn+'}');
	} else {
		var data = req.url.split('?');
		var params = ''+data[1];
		if (params.substring(0,5) == 'json=') {
			data=decodeURIComponent(params.substring(5)).replace(/\+/g, ' ').replace(/\r?\n|\r/g, '');
			offdata.crn[foundindex].registrations = JSON.parse(data);
			saveJSON();
			listRegistrations(res);
		} else {
			res.write(decodeURIComponent(req.url));
			res.write('<h1>EDIT</h1><h2>CRN :'+crn+'</h2>');
			res.write('<form action="" method="get"><textarea name="json" style="width: 300px;height: 150px;">');
			res.write(JSON.stringify(registrations, null, 4));
			res.write('</textarea><br/><input type="submit"></form>');
		}
	}
}
function addRegistration(res, crn, iom) {
	var found = 0;
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			res.write('CRN Already EXISTS');
		}
	}
	if (found === 0) {
		if (iom) {
			var newiomdata = loadJSON(newiomcrnfile); // Add IOM CRN
		} else {
			var newiomdata = loadJSON(newcrnfile);    // Add NON IOM CRN
		}
		newiomdata.crn = crn;
		offdata.crn.push(newiomdata);
		saveJSON();
		listRegistrations(res);
	}
}
/*----------------------------------ENDPOINTS---------------------------------*/
// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	list: function(res,parts){         //List CRNs
		listRegistrations(res);
	},
	addiom: function(res,parts){       //Add IOM CRN
		var crn=parts[2];
		if (crn !== undefined) {
		  addRegistration(res, crn, true);
		} else {
		  res.write(bad);
		}
	},
	addnoniom: function(res,parts){    //Add NON-IOM CRN
		var crn=parts[2];
		if (crn !== undefined) {
		  addRegistration(res, crn, false);
		} else {
		  res.write(bad);
		}
	},
	edit: function(res,parts,req){    //Add NON-IOM CRN
		var crn=parts[2];
		if (crn.indexOf('?') > 0) crn = crn.substring(0,crn.indexOf('?'));  //Strip url parameters from POST
		if (crn !== undefined) {
		  edit(res, crn, req);
		} else {
		  res.write(bad);
		}
	},
	crn: function(res,parts){          //List registrations for CRN
		var crn=parts[4];
		var func=parts[5];
		if (crn !== undefined && func == "registrations") {
		  displayRegistrations(res, crn);
		} else {
		  res.write(bad);
		}
	}
}
/*------------------------------------SERVER----------------------------------*/
var offdata = loadJSON(jsonfile);
http.createServer(function(req, res) {	//Example URL /secure/offenders/crn/23456/registrations
	var parts = req.url.split("/");
	//Get the endpoint function
	if (parts[1] == 'list') {
		endpoint = endpoints[parts[1]];
	} else if (parts[1] == 'addiom') {
		endpoint = endpoints[parts[1]];
	} else if (parts[1] == 'addnoniom') {
		endpoint = endpoints[parts[1]];
	} else if (parts[1] == 'edit') {
		endpoint = endpoints[parts[1]];
	}  else {
		endpoint = endpoints[parts[3]];
	}
	if (parts[1] == 'list' || parts[1] == 'addiom' || parts[1] == 'addnoniom' || parts[1] == 'edit') { //Skip security check-Call the endpoint
		res.writeHead(200, {'Content-Type': 'text/html'});
		endpoint ? endpoint(res,parts,req) : res.write('{"status":"Error"}');
	} else if (securityHeader(req) === true) {                                   //Do security check
		res.writeHead(200, {'Content-Type': 'text/plain'});
		endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
	} else {
		res.writeHead(401, 'missing authorization header');
	}
	res.end('');
}).listen(port, ip);
console.log("Running http://"+ip+":"+port);