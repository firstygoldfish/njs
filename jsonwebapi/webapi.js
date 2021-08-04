var http = require('http'),
    fs = require('fs');

var port = 8080;
var ip = "127.0.0.1";
var jsonfile = 'data.json';

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
	offdata.offenders.forEach(element => res.write('{"name":"'+element.name+'","offender_pk:"'+element.offender_pk+'"}}'));
}

function searchPK(res, offenders, offender_pk){
	var found=0;
	for (var i=0; i < offenders.length; i++) {
		if (offenders[i].offender_pk == offender_pk) {
			found++;
			res.write('{'+ok+',');
			res.write('{"name":"'+offenders[i].name+'"}}');
		}
	}
  if (found == 0) { res.write(notfound); }
}

function displayOfficers(res){
	res.write('{'+ok+',');
	offdata.officers.forEach(element => res.write('{"name":"'+element.name+'","id:"'+element.id+'"}}'));
}

var offdata = loadJSON(jsonfile);

// SETUP ENDPOINTS/OPERATIONS
var endpoints = {
	display: function(res,parts){ 
		displayOffenders(res); //Call displayOffenders function
	},
	search: function(res,parts){ 
		var offender_pk=parts[2];
		searchPK(res, offdata.offenders, offender_pk); //Call searchPK function
	},
	officers: function(res,parts){ 
		displayOfficers(res); //Call displayOfficers function
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
