var http = require('http'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

var port = 8080;
var ip = "127.0.0.1";

var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';

function displayOffenders(res){
	res.write('{'+ok+',');
	offdata.forEach(element => res.write('{"CRN":"'+element.crn+'"}}'));
}

// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	display: function(res,parts){ 
		displayOffenders(res); //Call displayOffenders function
	}
}

http.createServer(function(req, res) {	
	var parts = req.url.split("/");
	//Get the endpoint
	var endpoint = endpoints[parts[1]];
	res.writeHead(200, {'Content-Type': 'text/plain'});
	//Call the endpoint
	endpoint ? endpoint(res,parts) : res.write('{"status":"Error"}');
	res.end('');
}).listen(port, ip);

let db = new sqlite3.Database('my.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to my database.');
});

db.serialize(() => {
  db.each(`SELECT * FROM officers`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.name + "\t" + row.id);
  });
});

console.log("Server running at http://"+ip+":"+port);
