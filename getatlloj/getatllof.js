var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('C:\\Users\\p10114900\\Desktop\\ATL\\MIS_ODEAT_ONR_PJ.atl')
});
var lineb = [" "," "," "," "];
var indf = 0;
var inwc = 0;
var wcmsg = "";
lineReader.on('line', function (line) {
	var srch = "CREATE DATAFLOW";
	var dfpos = line.indexOf(srch);
	if (dfpos >= 0) {
		indf = 1;
		dfname=line.substr(dfpos+srch.length,line.indexOf(":")-(dfpos+srch.length));
	}
	var uipos = line.indexOf("ui_display_name = ");
	if (uipos >= 0 && indf > 0) {
		var fqpos = line.indexOf("'", uipos + 1);
		var lqpos = line.indexOf("'", fqpos + 1);
		uiname = line.substr(fqpos + 1, lqpos - fqpos - 1);
	}
	var ljpos = line.indexOf("LEFTOUTERJOIN");
	if (ljpos >= 0 && indf > 0) {
		if (lineb[3].length > 1 && lineb[3].indexOf("WHERE") >= 0) {
			wcmsg=lineb[3].trim();
			inwc = 3;
		} else {
			if (lineb[2].length > 1 && lineb[2].indexOf("WHERE") >= 0) {
				wcmsg=lineb[2].trim();
				inwc = 2;
			}
		}
		for (var i=inwc - 1; i>=0; i--) {
			if (lineb[i].length < 2) break;
			wcmsg = wcmsg + lineb[i].trim().replace(",",";");
		}
		if (wcmsg.length > 1) console.log(dfname+","+uiname+","+wcmsg+","+line.trim().substr(0,line.indexOf(")")).replace(",",";"));
		indf = 0;
		wcmsg = "";
	}
	lineb[3] = lineb[2];
	lineb[2] = lineb[1];
	lineb[1] = lineb[0];
	lineb[0] = line;
});