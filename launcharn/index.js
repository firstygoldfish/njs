/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
//import sqlite3 from "sqlite3";
import Database from "better-sqlite3";
//sqlite3 = require('sqlite3').verbose();
/*--------------------------------CONFIGURATION-------------------------------*/
var port = 3003;
/*----------------------------CORE VARIABLES----------------------------------*/
import {headercode, bgimg, bgimg2} from './images.js';
/*-----------------------------CORE FUNCTIONS---------------------------------*/

/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/

/*-----------------------------APP INITIALISE---------------------------------*/
const app = express();
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.get('/', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+'\
	<form action="/post" method="post"><br />Enter ID<input type="text" name="username"><br /><br />Area<input type="text" value="ESSEX" name="area"><br />URL<input type="text" value="https://www.google.com" name="returnURL"><button type="submit">Submit</button></form>');
	response.end('');
});
app.get('/oasys', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+'\
	<form action="/return" method="post"><br />Enter ID<input type="text" name="username"><br /><br />Area<input type="text" value="ESSEX" name="area"><button type="submit">Submit</button></form>');
	response.end('');
});
app.post('/return', (request, response)=> {
	let data = request.body;
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+' ');
	let row = null;
	try {
		row = db.prepare('SELECT * from user_data where username=\''+data.username+'\' AND area = \'' + data.area + '\'').get();
	} catch (err) {
		response.end(' ' + err);  return;
	}
	if (row && row.return_url != null) { response.end('<a href="' + row.return_url + '">Return to OASys</a>'); } else { response.end('NO-DATA-FOUND'); }
});
app.get('/count', (request, response)=> {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg));
	let row = null;
	try {
		row = db.prepare('SELECT count(*) as count from user_data').get();
	} catch (err) {
		response.end(' ' + err);  return;
	}
	response.end(row.count + ' records');
});
app.post('/dump', (request, response)=> {
	let data = request.body;
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+' ');
	response.end('<h1>Body</h1><hr><pre>' + JSON.stringify(data) + '</pre><hr>');
});
app.post('/post', (request, response)=> {
	let data = request.body;
	response.writeHead(200, {'Content-Type': 'text/html'});
	let row = null;
	try {
		row = db.prepare('SELECT * from user_data where username=\''+data.username+'\' AND area = \'' + data.area + '\'').get();
	} catch (err) {
		response.end(' ' + err);  return;
	}
	if (row && row.username != null) { 
		try {
			db.prepare('UPDATE user_data SET return_url = \'' + data.returnURL + '\' WHERE username = \'' + data.username + '\' AND area = \'' + data.area + '\'').run();
		} catch (err) {
			response.end(' ' + err);  return;
		}
		response.end(row.url);
	} else { response.end('NO-DATA-FOUND'); }
});
/*----------------------------START HTTP SERVER-------------------------------*/

const db = new Database('launcharndb.sqlite');
if (db) { console.log('Database opened'); } else { console.log('DB ERROR - Datbase NOT available'); }

app.listen(port, () => {
  console.log('Running on port ' + port);
});
