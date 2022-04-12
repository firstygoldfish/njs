/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
import express from "express";
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
	<form action="/post" method="post">Enter ID<input type="text" name="foo"><button type="submit">Submit</button></form>');
	response.end('');
});
app.post('/post', (request, response)=> {
	console.log(request.body.foo);
   //var foo = request.body.foo;
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(headercode.replace('~bg~',bgimg)+'\
	You submitted for ID: '+foo);
	response.end('');
});
/*----------------------------START HTTP SERVER-------------------------------*/
app.listen(port, () => {
  console.log('Running on port ' + port);
});