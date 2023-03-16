
var appname = 'Generic Stub';
var ip = '127.0.0.1';
var jsonfile = 'iomdata.json';
var newcrnfile = 'newcrndata.json';
var newiomcrnfile = 'newiomcrndata.json';
/*--------------------------DO NOT CHANGE BELOW HERE--------------------------*/
/*----------------------------------------------------------------------------*/
let headerbg = '<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,~bg~">';
let bgdata  = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAztJREFUaEPlWttu2kAQPah0FbvcSggKlSMESlEe2v7/f7QPURsVoaASNYRySXHkULlaszbG2OysDaRs/WZ7PDNnbp6d3VzR6rjAAvLLARxBxRjgLG/Ozhu4Hz0E93I+EQrGcFY9xf3dYPkixBvMe0BgmUeuaLVdX6ngG64jZxhcAgR/5IMhsM9E4suKguEG9FULGTZX73xy7fFIWMO3gKBQVTpsTRkKFVqfV2BbgVLoZ1Sq3CMdF848XmwUuUQ5HmantSquv3aRzNPEVaeFh+FoFU5S0IIgybDMjAutVfzL+Me9v2i38MYs4PrL59jPrz58xO/5I26/d9OwX+URj/FwaK3lSJS1ikdCocLBLP48Y9Drr3FsNC3kX71egaCGl0wPxoRHkIfBAPsxIcRS2M4omDhvvEO3d+N93Wpe4m7wY+cybM8riyUQwzxBpVxaWdCrWCHXpQAyg4NipHTGPVNi7VcwUfq5h8eTKez5EwdiuatYO2B5VUIQQxz+FTAgV6xbrmc41VJLUCTsgczeSJIndF8C2ccVZ5w9GYyrHw+EWk32YQAZzwTdEoCYyT+0kKAZgKJMMPE9mReL120TCNH9ZMFEIJyMzDNGx3UgfqMoyltYh6gQstAMQBJlxOgpT3Zmolw6wWQoGkuh2CGAcFHlWhWT6ZM01AlAAMMswR5P6a5X8EISqW8oo1KCPZ9Kfw9yIDtQ6hAsSEC2hlHBBLL2aFt4UENYDkRSxRqWhUF/vctV9YCUB6GSyoFstPbZ1iskkCl+yHIga8MAE+8vm/h208PMGW90tyQltxB5/RirBDKCVSYBmBxIUG5FW84YLqwGhqNfXiXb5cUrVK36Frf9gTeVUWk0yUB8hTnzeqEC21mkHwEldrIMBsvj56O6t5WB7NIDu+T1/wI5+tAKEu9ok1238hskJqGmZ07iFDLkya5Ti6JH05g5Tg7DgBRaeiysjnKpq9XwgbCIURrdKKQIdTUYN+LVeEDHLZjih6Rg+GykSiPTbKKWX7/IEJuYF6r4DrutoM1Gjz5bb20XumyGBkc4NmZY4gFlW+6f2J72txEiu6aqyc3pX/DAgCZHODQ6VKPJMSddDp79BVyqBYeVgEL/AAAAAElFTkSuQmCC';
let bgdata2 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAA1FJREFUaEPlWtFq2zAUPYEgEi9OyzbCAoayjOVh0P3/d6xvG9soBDLKNtakS4oJeFxLsmXH0pUzl8Wan1r7WtK555wrRdYgniUZbJcA5vME69uVNUQ/2CJFDFHE1f+nBz4xTR3NrxKs1ysgtQ9j4ALSNBgW0RMFcGNhgACxGhjXkDn+Lcr36rhcz45jS5a595xAfJNLndA1m0TYP+wa5VVPxHgS4U7F6mT59tcUx0prebXAev0TSHfgMk0iNn3iGhgBA0TBuJU5EWE+f46Pt1+cbQ/i2SJzuugEaf1NZqsS9U2MQCsgrgyW1cvuj7Yx/gwTkGSRIXXUtVp6fUxP+je9YjbhemYr5SzDogUjTfOAqyJx8whXhXwSVvavGaE7FlakKYFYTPIYbgB1+Ywvp/mt/a9N63chBLbpg+zfmGwrCRRyEpYeob8ZecnZVVYv7tLlOJ5EZbyIsG1TblW1YlcVBCT1BFKhOX/RzkyFMVEFopNgY7W4r/rwkTOxJoEkyww4sIxwLMhO5TW7nOZSarpIanfqWRcTYQ4EQ1W1dI8OnyQvX+F+8+gpLXv99zaxiHAxHWH1/RvrD+kRKr/mZfNKISllfpv5FDO2bHPFoigu1L4hsSN2lcn1/VJaDlbMLPpmlCu/Lql69VcBkktLeSRveQjpl7we+9iiiOEy3dTYKe/Q6kKKQY1VjfuYkRxDOxCtEHcRXJOVYXYTnerpXME0gCAVKUaIhYNEkE+O7aXVRaL92lDS0qIRRAIwmC3fZWL4DPebH9V2esLIxfQF0sNvDOLFMhsPR9jvHhWQ08zul80uokyzA+NohP3h0axakqKuZvkuhmxtQ83mxXjlzK7KL2mtKFbdLFmeBIwJIvczedtYory/vsanz1+VxM4fCEnq7ZvX+HBzI82ulygBAAlGWnqJ0nezh1J+w5kQ8/IbwBJFVq1gFo1qwahnsHNdZ+nxNS/jQ/1h1cCG10/P2nrkH/zUDWbzwQDS7+2gUDboPPZ++7Fl6gGEfHz+m9h6pzGIzwqem3HcLqO54caVX25zjuurWu3/x09v3OdknSEu0xTnG9PuY2g4n6fth2qIhR4dGHCcDvLcz+nBEY5ADtW0K4Ge9J0Yxo3FfTqoRwfP/gDLVTyTisG+ewAAAABJRU5ErkJggg==';
let cssData = '<style>.white { background-color: #FFFFDD; } .green { background-color: #00CC33; } .blue { background-color: #003C82; } .orange { background-color: #FFCC33; } .div { margin: auto; width: 50%; border: 3px solid #12A0D7; padding: 10px; } .button { border-radius: 8px; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;}</style>';
/*----------------------------CORE VARIABLES----------------------------------*/
var notfound = '{"status":"notfound"}';
var ok = '{"status":"ok"}';
var bad = '{"status":"badrequest"}';
/*-----------------------------CORE FUNCTIONS---------------------------------*/
function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}
function loadJSON(filename = '') {
	return JSON.parse(
		fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile()
	);
}
function saveJSON() {
	fs.writeFile(jsonfile, JSON.stringify(offdata, null, 4), (err) => {
	    if (err) {
	        throw err;
	    }
	});
}
function securityHeader(req){
	var secHeader = req.headers['authorization'];
	if (secHeader !== undefined && secHeader.substring(0,7) == "Bearer "){
		return true;
	} else {
		return false;
	}
}
/*--------------------------ENDPOINT FUNCTIONS--------------------------------*/
//const { headerbg, bgdata, bgdata2, cssData } = require("./images.js")
const { exec } = require("child_process")
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.write(headerbg.replace('~bg~',bgdata) + cssData);
  //res.write(cssData);
  res.write('<div class="div white">');
  res.write('<h1">'+appname+'</h1>');
  res.write('</div>');
  res.end();
})

app.get('/list', (req, res) => {
	res.write(headerbg.replace('~bg~',bgdata) + cssData);
	res.write('<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,'+bgdata2+');">');
	res.write('<div style="display: flex; justify-content: center"><table style="border-spacing:1px;"><tr><th style="color:#101010;padding:10px;">CRN</th>');
	res.write('<th style="color:#101010;padding:10px;">REGISTRATIONS</th></tr>')
	for (var i=0; i < offdata.crn.length; i++){
    bgcol = ((i+1)%2 === 0) ? 'B0BDDC' : 'DCCFB0'; //Odd/Even Colour
		res.write('<tr><td style="background-color:#'+bgcol+';padding:5px;vertical-align:top;"><b>'+offdata.crn[i].crn+'</b>');
		res.write('<br/><input type="button" value="Edit" onclick="javascript:window.location = \'/edit/'+offdata.crn[i].crn+'\'">');
		res.write('</td><td style="background-color: #'+bgcol+';padding:5px">');
		res.write('<pre>'+JSON.stringify(offdata.crn[i].registrations, null, 4)+'</pre></td></tr>');
	}	
	res.end('</table></div></html>');
})

app.get('/edit/:primarykey', (req, res) => {
	var crn = req.params.primarykey;
	var found = 0;
	var foundindex = 0;
	var registrations = '';
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			foundindex = i;
			registrations = offdata.crn[i].registrations;
		}
	}
	if (found === 0) {
		res.write(notfound+',{crn:'+crn+'}');
	} else {
		var data = req.url.split('?');
		var params = ''+data[1];
		if (params.substring(0,5) == 'json=') {
			data=decodeURIComponent(params.substring(5)).replace(/\+/g, ' ');
			offdata.crn[foundindex].registrations = JSON.parse(data);
			saveJSON();
			res.write('<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,'+bgdata+');">');
			res.write('<div style="display: flex; justify-content: center"><h2 style="color: #101010;">Changes saved.</h2></div><br/><input type="button" value="List Registrations" onclick="javascript:window.location = \'/list\'">');
			res.write('</html>');
		} else {
			res.write('<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,'+bgdata+');">');
			res.write('<head><meta charset="utf-8" /><meta name="viewport" /><title>Data Maintenance</title></head><body>\n');
			res.write('<div style="display: flex; justify-content: center"><h1 style="color: #101010;">EDIT CRN :'+crn+'</h1></div>\n');
			res.write('<div style="display: flex; justify-content: center">\n');
			res.write('<form action="/edit?primarykey='+crn+'" method="post"><textarea name="json" style="width: 600px;height: 400px;">\n');
			res.write(JSON.stringify(registrations, null, 4));
			res.write('</textarea><br/><input type="submit" value="Save">&nbsp;<input type="button" value="Cancel" onclick="javascript:window.location = \'/list\'"></form></div></body></html>');
		}
	}
})

app.post('/edit', (req, res) => {
	var crn = req.body.primarykey;
	var found = 0;
	var foundindex = 0;
	var registrations = '';
	for (var i=0; i< offdata.crn.length; i++){
		if (offdata.crn[i].crn == crn) {
			found++;
			foundindex = i;
			registrations = offdata.crn[i].registrations;
		}
	}
	if (found === 0) {
		res.write(notfound+',{crn:'+crn+'}');
	} else {
			data=decodeURIComponent(params.substring(5)).replace(/\+/g, ' ');
			offdata.crn[foundindex].registrations = JSON.parse(data);
			saveJSON();
			res.write('<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,'+bgdata+');">');
			res.write('<div style="display: flex; justify-content: center"><h2 style="color: #101010;">Changes saved.</h2></div><br/><input type="button" value="List Registrations" onclick="javascript:window.location = \'/list\'">');
			res.write('</html>');
	}
})
/*------------------------------------SERVER----------------------------------*/
// Load the JSON data
var offdata = loadJSON(jsonfile);
// Start the server
app.listen(port, () => {
  console.log('Transfer server listening on port ' + port)
})