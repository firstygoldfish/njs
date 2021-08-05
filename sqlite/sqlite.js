var http = require('http'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

var port = 8080;
var ip = "127.0.0.1";

var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';

function displayOfficers(res){
	sql = 'SELECT * from OFFICERS';
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
		}
		if (rows.length > 0) {
			res.write('<table border=1><tr><th>ID</th><th>Username</th></tr>');
			rows.forEach((row) => {
				res.write('<tr><td>'+row.id+'</td><td>'+row.name+'</td></tr>');
			})
			res.end('</table>');
		} else {
			res.end('No data found');
		}
	});
}

function displayOfficer(res,name){
	sql = 'SELECT * from OFFICERS where name=\''+name+'\'';
	db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
		}
		if (rows.length > 0) {
		res.write('<table border=1><tr><th>ID</th><th>Username</th></tr>');
		rows.forEach((row) => {
			res.write('<tr><td>'+row.id+'</td><td>'+row.name+'</td></tr>');
		})
		res.end('</table>');
		} else {
			res.end('No data found');
		}
	});
}

http.createServer(function(req, res) {	
	var parts = req.url.split("/");
	res.writeHead(200, {'Content-Type': 'text/html'});
	//Call the endpoint - Check first part of the URL request
	if (parts[1] == "officers") {
		displayOfficers(res);           // Call display officers
	} else if (parts[1] == "officer") {
		displayOfficer(res,parts[2]);              // Call display users
	} else {
		res.end('Invalid or Missing Request'); // End the response with error
	}
}).listen(port, ip);

db = new sqlite3.Database('my.db', (err) => { // Open the database
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to my database.');
});

console.log("Server running at http://"+ip+":"+port);
