/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
/*--------------------------------CONFIGURATION-------------------------------*/
var port = 8088;
var ip = "127.0.0.1";
var jsonfile = 'iomdata.json';
var newcrnfile = 'newcrndata.json';
var newiomcrnfile = 'newiomcrndata.json';
/*----------------------------CORE VARIABLES----------------------------------*/
var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';
var bad = '{"status":"badrequest"}';
var endpoint = '';
import {headerbg, bgdata, bgdata2} from './images.js';
/*-----------------------------CORE FUNCTIONS---------------------------------*/
function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}
function loadJSON(filename = '') {
	return JSON.parse(fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile() );
}
function saveJSON() {
	fs.writeFile(jsonfile, JSON.stringify(offdata, null, 4), (err) => {
	    if (err) { throw err; }
	});
}
function securityHeader(req){
	var secHeader = req.headers['authorization'];
	if (secHeader !== undefined && secHeader.substring(0,7) == "Bearer "){ return true; } else { return false; }
}
/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
function listRegistrations(res) {
	res.write(headerbg.replace('~bg~',bgdata)+'<div style="display: flex; justify-content: center">');
	res.write('<table style="border-spacing:1px;"><tr><th style="color:#101010;padding:10px;">CRN</th>');
	res.write('<th style="color:#101010;padding:10px;">REGISTRATIONS</th></tr>')
	for (var i=0; i < offdata.crn.length; i++){
		var bgcol = ((i+1)%2 === 0) ? 'B0BDDCC0' : 'DCCFB0C0'; //Odd/Even Colour
		res.write('<tr><td style="background-color:#'+bgcol+';padding:5px;vertical-align:top;"><b>'+offdata.crn[i].crn+'</b>');
		res.write('<br/><input type="button" value="Edit" onclick="javascript:window.location = \'/edit/'+offdata.crn[i].crn+'\'">');
		res.write('</td><td style="background-color: #'+bgcol+';padding:5px">');
		res.write('<pre>'+JSON.stringify(offdata.crn[i].registrations, null, 4)+'</pre></td></tr>');
	}
	res.write('</table></div></html>');
}
function displayRegistrations(res, crn) {
	var found = 0;
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			res.write('{\"registrations\": ');
			res.write(JSON.stringify(offdata.crn[i].registrations, null, 4));
			res.write('}');
		}
	}
	if (found === 0) res.write(notfound);
}
function edit(req, res, crn) {
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
		var data = req.query.json; // $_GET["json"]
		if (data !== undefined) {
			offdata.crn[foundindex].registrations = JSON.parse(data);
			saveJSON();
			res.write(headerbg.replace('~bg~',bgdata2)+'<div style="display: flex; justify-content: center">');
			res.write('<h2 style="color: #101010;">Changes saved.</h2></div>');
			res.write('<div style="display: flex; justify-content: center">');
			res.write('<input type="button" value="List Registrations" onclick="javascript:window.location = \'/list\'"></div></html>');
		} else {
			res.write(headerbg.replace('~bg~',bgdata2)+'<head><meta charset="utf-8" /><meta name="viewport" />');
			res.write('<title>Data Maintenance</title></head><body>\n');
			res.write('<div style="display: flex; justify-content: center"><h1 style="color: #101010;">EDIT CRN :'+crn+'</h1></div>\n');
			res.write('<div style="display: flex; justify-content: center">\n');
			res.write('<form action="" method="get"><textarea name="json" style="width: 600px;height: 400px;">\n');
			res.write(JSON.stringify(registrations, null, 4));
			res.write('</textarea><br/><input type="submit" value="Save">&nbsp;');
			res.write('<input type="button" value="Cancel" onclick="javascript:window.location = \'/list\'"></form></div></body></html>');
		}
	}
}
function addRegistrations(res, crn, iom) {
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
/*-----------------------------APP INITIALISE---------------------------------*/
var offdata = loadJSON(jsonfile);
const app = express();
app.use(express.json());
app.get('/list', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	listRegistrations(response);
	response.end('');
});
app.get('/secure/offenders/crn/:crn/registrations/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/plain'});
	displayRegistrations(response,crn);
	response.end('');
});
app.get('/edit/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	edit(request,response,crn);
	response.end('');
});
app.get('/addiom/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	addRegistrations(response,crn,true);
	response.end('');
});
app.get('/addnoniom/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	addRegistrations(response,crn,false);
	response.end('');
});
/*----------------------------START HTTP SERVER-------------------------------*/
app.listen(port, () => {
  console.log('Running on port ' + port);
});