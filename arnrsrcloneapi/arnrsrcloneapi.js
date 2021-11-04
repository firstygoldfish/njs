/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
/*--------------------------------CONFIGURATION-------------------------------*/
var port = 8088;
var ip = "127.0.0.1";
var jsonfile = 'episodedata.json';
var newcrnfile = 'newcrndata.json';
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
function securityHeader(request){
	var secHeader = request.headers['authorization'];
	if (secHeader !== undefined && secHeader.substring(0,7) == "Bearer "){ return true; } else { return false; }
}
/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
function homeFunc(response) {
	response.write(headerbg.replace('~bg~',bgdata2)+'\
	<div style="display:flex;justify-content:center">\
	<h2 style="color: #101010;">ARN RSR Cloning API Stub</h2></div><p> </p>\
	<div style="display:flex;justify-content:center">\
	<input type="button" value="List Episodes" onclick="javascript:window.location = \'/list\'"></div><p> </p>\
	<div style="display:flex;justify-content:center">\
	<form><label style="font-weight:bold;">Add New CRN: </label><input id="crn" type="test"></input>\
	<input type="button" value="Create" onclick="javascript:window.location = \'/add/\'+document.getElementById(\'crn\').value">');
}
function listFunc(response) {
	response.write(headerbg.replace('~bg~',bgdata)+'\
			<div style="display:flex;justify-content:center"><h1>CRN DATA LIST</h1></div>\
			<div style="display:flex;justify-content:center"><form><label style="font-weight:bold;">Add New CRN: </label><input id="crn" type="test"></input>\
			<input type="button" value="Create" onclick="javascript:window.location = \'/add/\'+document.getElementById(\'crn\').value"></form></div><p> </p>\
			<div style="display:flex;justify-content:center">\
			<table style="border-spacing:1px;"><tr><th style="color:#101010;padding:10px;"></th>\
			<th style="color:#101010;padding:10px;">EPISODES (Assessment Answers)</th></tr>');
	for (var i=0; i < offdata.crns.length; i++){
		var bgcol = ((i+1)%2 === 0) ? 'B0BDDCC0' : 'DCCFB0C0'; //Odd&Even Colour
		response.write('\
			<tr><td style="background-color:#'+bgcol+';padding:5px;vertical-align:top;"><b>CRN:'+offdata.crns[i].crn+'</b>\
			<br/><br/><input type="button" value="Edit" onclick="javascript:window.location = \'/edit/'+offdata.crns[i].crn+'\'">\
			<br/><br/><input type="button" value="Delete!" onclick="javascript:if(confirm(\'Are you sure you want to delete CRN '+offdata.crns[i].crn+'?\')) window.location = \'/delete/'+offdata.crns[i].crn+'\'">\
			</td><td style="background-color: #'+bgcol+';padding:5px">\
			<textarea readonly style="min-height: 200px; min-width: 600px;background-color:#'+bgcol+';">'+JSON.stringify(offdata.crns[i].episodes, null, 4)+'</textarea></td></tr>');
	}
	response.write('</table></div></html>');
}
function displayFunc(response, crn) {
	var found = 0;
	for (var i=0; i< offdata.crns.length; i++){
		if (offdata.crns[i].crn == crn) {
			found++;
			response.write('{\"episodes\": ');
			response.write(JSON.stringify(offdata.crns[i].episodes, null, 4));
			response.write('}');
		}
	}
	if (found === 0) response.write(notfound);
}
function editFunc(request, response, crn) {
	var found = 0;
	var foundindex = 0;
	var episodes = '';
	for (var i=0; i< offdata.crns.length; i++){
		if (offdata.crns[i].crn == crn) {
			found++;
			foundindex = i;
			episodes = offdata.crns[i].episodes;
		}
	}
	if (found === 0) {
		response.write(notfound+',{crn:'+crn+'}');
	} else {
		var data = request.query.json; // $_GET["json"]
		if (data !== undefined) {
			offdata.crns[foundindex].episodes = JSON.parse(data);
			saveJSON();
			response.write(headerbg.replace('~bg~',bgdata2)+'\
				<div style="display:flex;justify-content:center">\
				<h2 style="color: #101010;">Changes saved.</h2></div>\
				<div style="display:flex;justify-content:center">\
				<input type="button" value="List Episodes" onclick="javascript:window.location = \'/list\'"></div></html>');
		} else {
			response.write(headerbg.replace('~bg~',bgdata2)+'\
				<head><meta charset="utf-8" /><meta name="viewport" /><title>Data Maintenance</title></head><body>\n\
				<div style="display: flex; justify-content: center"><h1 style="color: #101010;">EDIT CRN :'+crn+'</h1></div>\n\
				<div style="display: flex; justify-content: center">\n\
				<form action="" method="get"><textarea name="json" style="width: 600px;height: 400px;">\n'+JSON.stringify(episodes, null, 4)+'\n\
				</textarea><br/><input type="submit" value="Save">&nbsp;\
				<input type="button" value="Cancel" onclick="javascript:window.location = \'/list\'"></form></div></body></html>');
		}
	}
}
function addFunc(response, crn) {
	var found = 0;
	for (var i=0; i< offdata.crns.length; i++){
		if (offdata.crns[i].crn == crn) {
			found++;
		}
	}
	if (found === 0) {
		var newdata = loadJSON(newcrnfile); // Add IOM CRN
		newdata.crn = crn;
		offdata.crns.push(newdata);
		saveJSON();
		listFunc(response);
	} else {
		response.write(headerbg.replace('~bg~',bgdata2)+'\
		<div style="display:flex;justify-content:center">\
		<h2 style="color: #101010;">CRN Already Exists!!!</h2></div>\
		<div style="display:flex;justify-content:center">\
		<input type="button" value="List Episodes" onclick="javascript:window.location = \'/list\'"></div></html>');
	}
}
function deleteFunc(response, crn) {
	var found = -1;
	for (var i=0; i< offdata.crns.length; i++){
		if (offdata.crns[i].crn == crn) {
			found=i;
		}
	}
	if (found > -1) {
		offdata.crns.splice(found,1);
		saveJSON();
		listFunc(response);
	} else {
		response.write(headerbg.replace('~bg~',bgdata2)+'\
		<div style="display:flex;justify-content:center">\
		<h2 style="color: #101010;">CRN NOT Found!!!</h2></div>\
		<div style="display:flex;justify-content:center">\
		<input type="button" value="List Episodes" onclick="javascript:window.location = \'/list\'"></div></html>');
	}
}
/*-----------------------------APP INITIALISE---------------------------------*/
var offdata = loadJSON(jsonfile);
const app = express();
app.use(express.json());
app.get('/', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	homeFunc(response);
	response.end('');
});
app.get('/list', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	listFunc(response);
	response.end('');
});
app.get('/subject/:crn/assessments/episodes/RSR/latest/', (request, response)=> {
	var crn = request.params.crn;
	if (securityHeader(request) === true) {                                   //Do security check
		response.writeHead(200, {'Content-Type': 'text/plain'});
		displayFunc(response,crn);
	} else {
		response.writeHead(401, 'missing authorization header');
	}
	response.end('');
});
app.get('/edit/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	editFunc(request,response,crn);
	response.end('');
});
app.get('/add/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	addFunc(response,crn);
	response.end('');
});
app.get('/delete/:crn/', (request, response)=> {
	var crn = request.params.crn;
	response.writeHead(200, {'Content-Type': 'text/html'});
	deleteFunc(response,crn);
	response.end('');
});
/*----------------------------START HTTP SERVER-------------------------------*/
app.listen(port, () => {
  console.log('Running on port ' + port);
});