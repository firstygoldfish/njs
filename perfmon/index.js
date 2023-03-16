let headerbg = '<!DOCTYPE html><html style="position: relative; min-height: 100%; background: local url(data:image/gif;base64,~bg~">';
let bgdata  = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAztJREFUaEPlWttu2kAQPah0FbvcSggKlSMESlEe2v7/f7QPURsVoaASNYRySXHkULlaszbG2OysDaRs/WZ7PDNnbp6d3VzR6rjAAvLLARxBxRjgLG/Ozhu4Hz0E93I+EQrGcFY9xf3dYPkixBvMe0BgmUeuaLVdX6ngG64jZxhcAgR/5IMhsM9E4suKguEG9FULGTZX73xy7fFIWMO3gKBQVTpsTRkKFVqfV2BbgVLoZ1Sq3CMdF848XmwUuUQ5HmantSquv3aRzNPEVaeFh+FoFU5S0IIgybDMjAutVfzL+Me9v2i38MYs4PrL59jPrz58xO/5I26/d9OwX+URj/FwaK3lSJS1ikdCocLBLP48Y9Drr3FsNC3kX71egaCGl0wPxoRHkIfBAPsxIcRS2M4omDhvvEO3d+N93Wpe4m7wY+cybM8riyUQwzxBpVxaWdCrWCHXpQAyg4NipHTGPVNi7VcwUfq5h8eTKez5EwdiuatYO2B5VUIQQxz+FTAgV6xbrmc41VJLUCTsgczeSJIndF8C2ccVZ5w9GYyrHw+EWk32YQAZzwTdEoCYyT+0kKAZgKJMMPE9mReL120TCNH9ZMFEIJyMzDNGx3UgfqMoyltYh6gQstAMQBJlxOgpT3Zmolw6wWQoGkuh2CGAcFHlWhWT6ZM01AlAAMMswR5P6a5X8EISqW8oo1KCPZ9Kfw9yIDtQ6hAsSEC2hlHBBLL2aFt4UENYDkRSxRqWhUF/vctV9YCUB6GSyoFstPbZ1iskkCl+yHIga8MAE+8vm/h208PMGW90tyQltxB5/RirBDKCVSYBmBxIUG5FW84YLqwGhqNfXiXb5cUrVK36Frf9gTeVUWk0yUB8hTnzeqEC21mkHwEldrIMBsvj56O6t5WB7NIDu+T1/wI5+tAKEu9ok1238hskJqGmZ07iFDLkya5Ti6JH05g5Tg7DgBRaeiysjnKpq9XwgbCIURrdKKQIdTUYN+LVeEDHLZjih6Rg+GykSiPTbKKWX7/IEJuYF6r4DrutoM1Gjz5bb20XumyGBkc4NmZY4gFlW+6f2J72txEiu6aqyc3pX/DAgCZHODQ6VKPJMSddDp79BVyqBYeVgEL/AAAAAElFTkSuQmCC';
let bgdata2 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAA1FJREFUaEPlWtFq2zAUPYEgEi9OyzbCAoayjOVh0P3/d6xvG9soBDLKNtakS4oJeFxLsmXH0pUzl8Wan1r7WtK555wrRdYgniUZbJcA5vME69uVNUQ/2CJFDFHE1f+nBz4xTR3NrxKs1ysgtQ9j4ALSNBgW0RMFcGNhgACxGhjXkDn+Lcr36rhcz45jS5a595xAfJNLndA1m0TYP+wa5VVPxHgS4U7F6mT59tcUx0prebXAev0TSHfgMk0iNn3iGhgBA0TBuJU5EWE+f46Pt1+cbQ/i2SJzuugEaf1NZqsS9U2MQCsgrgyW1cvuj7Yx/gwTkGSRIXXUtVp6fUxP+je9YjbhemYr5SzDogUjTfOAqyJx8whXhXwSVvavGaE7FlakKYFYTPIYbgB1+Ywvp/mt/a9N63chBLbpg+zfmGwrCRRyEpYeob8ZecnZVVYv7tLlOJ5EZbyIsG1TblW1YlcVBCT1BFKhOX/RzkyFMVEFopNgY7W4r/rwkTOxJoEkyww4sIxwLMhO5TW7nOZSarpIanfqWRcTYQ4EQ1W1dI8OnyQvX+F+8+gpLXv99zaxiHAxHWH1/RvrD+kRKr/mZfNKISllfpv5FDO2bHPFoigu1L4hsSN2lcn1/VJaDlbMLPpmlCu/Lql69VcBkktLeSRveQjpl7we+9iiiOEy3dTYKe/Q6kKKQY1VjfuYkRxDOxCtEHcRXJOVYXYTnerpXME0gCAVKUaIhYNEkE+O7aXVRaL92lDS0qIRRAIwmC3fZWL4DPebH9V2esLIxfQF0sNvDOLFMhsPR9jvHhWQ08zul80uokyzA+NohP3h0axakqKuZvkuhmxtQ83mxXjlzK7KL2mtKFbdLFmeBIwJIvczedtYory/vsanz1+VxM4fCEnq7ZvX+HBzI82ulygBAAlGWnqJ0nezh1J+w5kQ8/IbwBJFVq1gFo1qwahnsHNdZ+nxNS/jQ/1h1cCG10/P2nrkH/zUDWbzwQDS7+2gUDboPPZ++7Fl6gGEfHz+m9h6pzGIzwqem3HcLqO54caVX25zjuurWu3/x09v3OdknSEu0xTnG9PuY2g4n6fth2qIhR4dGHCcDvLcz+nBEY5ADtW0K4Ge9J0Yxo3FfTqoRwfP/gDLVTyTisG+ewAAAABJRU5ErkJggg==';
let cssData = '<style>.white { background-color: #FFFFDD; } .green { background-color: #00CC33; } .blue { background-color: #003C82; } .orange { background-color: #FFCC33; } .div { margin: auto; width: 50%; border: 3px solid #12A0D7; padding: 10px; } .button { border-radius: 8px; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;}</style>';

const { exec } = require("child_process")
const express = require('express')
const fs = require('fs')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.write(headerbg.replace('~bg~',bgdata2) + cssData);
  res.write('<div class="div white">');
  res.write('<h1 style="display:none;" id="header">Performance Indicators</h1>');
  res.write('<h3 id="wait">Wait for the page to complete loading. Do NOT refresh this page....</h3>');
  // HAND OFF TO COMMAND PROCESSOR
  doCmd(res, './gatherstats.sh');
})

app.listen(port, () => {
  console.log('Transfer server listening on port ' + port)
})

// #########FUNTIONS###############

async function doCmd(res, cmd) {
  await exec(cmd, (error, stdout, stderr) => {
	if (error) {
	  res.write('ERROR: ' + error.message);
	  return;
	}
	if (stderr) {
	  res.write('ERROR: ' + stderr);
	  return;
	}
	displayCmdOutput(res,stdout);  // FORMAT OUTPUT
	return;
  });
}

function displayCmdOutput(res,cmdoutp) {
	var data = JSON.parse(cmdoutp);
	res.write('<h2>CPU STATS</h2>');
	res.write('<label for="idle">IDLE:</label><progress id="idle" value="'+data.CPU.IDLE+'" max="100"> '+data.CPU.IDLE+'% </progress>');
	res.write('<label for="sys">SYS:</label><progress id="sys" value="'+data.CPU.SYS+'" max="100"> '+data.CPU.IDLE+'% </progress>');
	res.write('<label for="user">USER:</label><progress id="user" value="'+data.CPU.USER+'" max="100"> '+data.CPU.IDLE+'% </progress><hr>');
	res.write('<h2>CPU INTENSIVE PROCESSES</h2>');
	for (var proc in data.CPUPROCS)
	{
	  res.write('['+data.CPUPROCS[proc].PID+':'+data.CPUPROCS[proc].CMD+']');
	  res.write('<progress value="'+data.CPUPROCS[proc].CPU+'" max="100"> '+data.CPUPROCS[proc].CPU+'% </progress>'+data.CPUPROCS[proc].CPU+'%<br>');
	}
	res.write('<h2>MEMORY USAGE PROCESSES</h2>');
	for (var proc in data.MEMPROCS)
	{
	  res.write('['+data.MEMPROCS[proc].PID+':'+data.MEMPROCS[proc].CMD+']');
	  res.write('<progress value="'+data.MEMPROCS[proc].MEM+'" max="100"> '+data.MEMPROCS[proc].MEM+'% </progress>'+data.MEMPROCS[proc].MEM+'%<br>');
	}
	footer(res);
}

function footer(res) {
	res.write('<script>document.getElementById(\'header\').style.display = \'block\';document.getElementById(\'wait\').style.display = \'none\';</script>');
	//res.write('<hr><a class="button orange" href="javascript:history.back()">Go Back</a>');
	res.end('</div>');
}
