/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
sqlite3 = require('sqlite3').verbose();
/*--------------------------------CONFIGURATION-------------------------------*/
var port = 8080;
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
	<form action="/post" method="post"><br />Enter ID<input type="text" name="username"><br /><br />URL<input type="text" value="www.google.com" name="returnURL"><button type="submit">Submit</button></form>');
	response.end('');
});
app.post('/post', (request, response)=> {
    let data = request.body;
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+'<br />You submitted USERNAME: ' + data.username);
	response.write('<br />Return URL: ' + data.returnURL);
	
	sql = 'SELECT * from user_data where username=\''+data.username+'\'';
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
		}
		if (rows.length > 0) {
			res.write(row.url);
		} else {
			res.end('No data found');
		}
	});
	
    response.end('');
});
/*----------------------------START HTTP SERVER-------------------------------*/

db = new sqlite3.Database('launcharndb.sqlite', (err) => { // Open the database
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to launcharndb.sqlite database.');
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
