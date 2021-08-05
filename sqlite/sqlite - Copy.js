var http = require('http'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

var port = 8080;
var ip = "127.0.0.1";

var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';

function displayOfficers(res){
	sql = 'SELECT * from OFFICERS';
  console.log('QUERY');
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
		}
		console.log('OUTPUT');
		res.write('<table border=1><tr><th>ID</th><th>Username</th></tr>');
		rows.forEach((row) => {
			res.write('<tr><td>'+row.id+'</td><td>'+row.name+'</td></tr>');
		})
		res.write('</table>');
		res.end('');
	});
}

// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	officers: function(res,parts){ 
		displayOfficers(res,db); //Call displayOffenders function
	}
}

http.createServer(function(req, res) {	
	var parts = req.url.split("/");
	//Get the endpoint
	var endpoint = endpoints[parts[1]];
	res.writeHead(200, {'Content-Type': 'text/html'});
	//Call the endpoint
	endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
}).listen(port, ip);

db = new sqlite3.Database('my.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to my database.');
});

console.log("Server running at http://"+ip+":"+port);
