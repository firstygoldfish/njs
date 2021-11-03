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
function securityHeader(req){
	var secHeader = req.headers['authorization'];
	if (secHeader !== undefined && secHeader.substring(0,7) == "Bearer "){ return true; } else { return false; }
}
/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
function listFunc(res) {
	res.write(headerbg.replace('~bg~',bgdata)+'\
			<div style="display:flex;justify-content:center">\
			<table style="border-spacing:1px;"><tr><th style="color:#101010;padding:10px;">CRN</th>\
			<th style="color:#101010;padding:10px;">EPISODES (Assessment Answers)</th></tr>');
	for (var i=0; i < offdata.crns.length; i++){
		var bgcol = ((i+1)%2 === 0) ? 'B0BDDCC0' : 'DCCFB0C0'; //Odd&Even Colour
		res.write('\
			<tr><td style="background-color:#'+bgcol+';padding:5px;vertical-align:top;"><b>'+offdata.crns[i].crn+'</b>\
			<br/><input type="button" value="Edit" onclick="javascript:window.location = \'/edit/'+offdata.crns[i].crn+'\'">\
			</td><td style="background-color: #'+bgcol+';padding:5px">\
			<pre>'+JSON.stringify(offdata.crns[i].episodes, null, 4)+'</pre></td></tr>');
	}
	res.write('</table></div></html>');
}
function displayFunc(res, crn) {
	var found = 0;
	for (var i=0; i< offdata.crns.length; i++){
		if (offdata.crns[i].crn == crn) {
			found++;
			res.write('{\"episodes\": ');
			res.write(JSON.stringify(offdata.crns[i].episodes, null, 4));
			res.write('}');
		}
	}
	if (found === 0) res.write(notfound);
}
function editFunc(req, res, crn) {
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
		res.write(notfound+',{crn:'+crn+'}');
	} else {
		var data = req.query.json; // $_GET["json"]
		if (data !== undefined) {
			offdata.crns[foundindex].episodes = JSON.parse(data);
			saveJSON();
			res.write(headerbg.replace('~bg~',bgdata2)+'\
				<div style="display:flex;justify-content:center">\
				<h2 style="color: #101010;">Changes saved.</h2></div>\
				<div style="display:flex;justify-content:center">\
				<input type="button" value="List episodes" onclick="javascript:window.location = \'/list\'"></div></html>');
		} else {
			res.write(headerbg.replace('~bg~',bgdata2)+'\
				<head><meta charset="utf-8" /><meta name="viewport" /><title>Data Maintenance</title></head><body>\n\
				<div style="display: flex; justify-content: center"><h1 style="color: #101010;">EDIT CRN :'+crn+'</h1></div>\n\
				<div style="display: flex; justify-content: center">\n\
				<form action="" method="get"><textarea name="json" style="width: 600px;height: 400px;">\n'+JSON.stringify(episodes, null, 4)+'\n\
				</textarea><br/><input type="submit" value="Save">&nbsp;\
				<input type="button" value="Cancel" onclick="javascript:window.location = \'/list\'"></form></div></body></html>');
		}
	}
}
function addFunc(res, crn) {
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
		listFunc(res);
	} else {
		res.write(headerbg.replace('~bg~',bgdata2)+'\
		<div style="display:flex;justify-content:center">\
		<h2 style="color: #101010;">CRN Already Exists!!!</h2></div>\
		<div style="display:flex;justify-content:center">\
		<input type="button" value="List episodes" onclick="javascript:window.location = \'/list\'"></div></html>');
	}
}
/*-----------------------------APP INITIALISE---------------------------------*/
//	GET /subject/X259951/assessments/episodes/RSR/latest
//  "crn: eg "X259951" – offender.cms_prob_number

var offdata = loadJSON(jsonfile);
const app = express();
app.use(express.json());
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
/*----------------------------START HTTP SERVER-------------------------------*/
app.listen(port, () => {
  console.log('Running on port ' + port);
});