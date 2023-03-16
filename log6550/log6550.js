// PNJ PROJECT log6550 
var getTime = 0
var opMsg = ""
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('alert_OASPROD.log')
});

lineReader.on('line', function (line) {
	if (getTime > 0) {
		opMsg = opMsg + line
		console.log(opMsg.replace(/, /g,','))
		getTime=0
	} else {
	  if (line.indexOf(' error=6550 ') > -1) {
		opMsg=line.replace(' for statement:',',')
		getTime=1
	  }
	}
});
