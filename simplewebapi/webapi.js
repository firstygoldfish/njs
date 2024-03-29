var sys = require('sys'),
    http = require('http'),
    fs = require('fs');

var port = 8080;
var ip = "127.0.0.1";

function loadJSON(filename = '') {
	return JSON.parse(
		fs.existsSync(filename) ? fs.readFileSync(filename).toString() : 'null'
	)
}

var operations = {
	add: function(a,b){ return a + b},
	sub: function(a,b){ return a - b},
	mul: function(a,b){ return a * b},
	div: function(a,b){ return a / b},
}
	
http.createServer(function(req, res) {
	var parts = req.url.split("/"),
	       op = operations[parts[1]],
	        a = parseInt(parts[2], 10),
	        b = parseInt(parts[3], 10);
	        
	var result = op ? op(a, b) : "Error";
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(loadJSON('data.json'));
	res.end(""+result);
}).listen(port, ip);

console.log("Server running at http://"+ip+":"+port);
