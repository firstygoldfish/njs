var http = require('http'),
    fs = require('fs');

var port = 8080;
var ip = "127.0.0.1";
var jsonfile = 'iomdata.json';

var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';

function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}

function loadJSON(filename = '') {
	return JSON.parse(
		fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile()
	);
}

function displayOffenders(res){
	res.write('{'+ok+',');
	offdata.forEach(element => res.write('{"CRN":"'+element.crn+'"}}'));
}

var offdata = loadJSON(jsonfile);

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

console.log("Server running at http://"+ip+":"+port);
