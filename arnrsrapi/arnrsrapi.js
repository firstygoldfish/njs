/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
/*--------------------------------CONFIGURATION-------------------------------*/
var port = 8082;
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

/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
function listParameters(req, res)
{
	var crn = req.query.crn; // $_GET["crn"]
	var eventId = req.query.eventId;
	var assessmentType = req.query.assessmentType;
	var oasysOffenderPk = req.query.oasysOffenderPk;
	
	res.write(headerbg.replace('~bg~',bgdata2)+'\
				<div style="display:flex;justify-content:center">\
				<h2 style="color: #101010;">ARN RSR Calculator Test API</h2></div>\
				<div style="display:flex;justify-content:center"><h1>crn='+crn+'</h1></div></html>\
				<div style="display:flex;justify-content:center"><h1>eventId='+eventId+'</h1></div></html>\
				<div style="display:flex;justify-content:center"><h1>assessmentType='+assessmentType+'</h1></div></html>\
				<div style="display:flex;justify-content:center"><h1>oasysOffenderPk='+oasysOffenderPk+'</h1></div></html>');
}
/*-----------------------------APP INITIALISE---------------------------------*/
const app = express();
app.use(express.json());
app.get('/assessment-from-oasys', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	listParameters(request, response);
	response.end('');
});
/*----------------------------START HTTP SERVER-------------------------------*/
app.listen(port, () => {
  console.log('Running on port ' + port);
});