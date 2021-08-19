var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('C:\\Users\\p10114900\\Desktop\\ATL\\export_all_from_systest.atl')
});
var lineb = [" "," "," "," "];
var indf = 0;
var inlj = 0;
var wcmsg = "";
var dfname = "";
var uiname = "";
var fromname = "";
var lj = "";
var where = "";
lineReader.on('line', function (line) {
	var srch = "CREATE  DATAFLOW";
	var dfpos = line.indexOf(srch);
	if (dfpos >= 0) {
		indf = 1;
		dfname=line.substr(dfpos+srch.length,line.indexOf(":")-(dfpos+srch.length));
	}
	var uipos = line.indexOf("ui_display_name\" = ");
	if (uipos >= 0 && indf > 0) {
		var fqpos = line.indexOf("'", uipos + 1);
		var lqpos = line.indexOf("'", fqpos + 1);
		uiname = line.substr(fqpos + 1, lqpos - fqpos - 1);
	}
	if (inlj > 0) {
		if (line.length > 1) {
			where = where + line;
		} else {
			inlj = 0;
			console.log(dfname+","+uiname+","+fromname+","+lj.replace(/,/g,";")+","+where.replace(/,/g,";").trim());
			where="";
		}
	}
	var ljpos = line.indexOf("__SAP_LEFT_OUTER_JOIN");
	if (ljpos >= 0 && indf > 0 && inlj == 0) {
		srch = " FROM ";
		var frompos = line.indexOf(srch);
		fromname = line.substr(frompos+srch.length, line.indexOf(" ", frompos+srch.length)-frompos-srch.length);
		lj = line.substr(ljpos);
		inlj = 1;
		//console.log(dfname+","+uiname+","+fromname+","+lj);
		
	}
	lineb[3] = lineb[2];
	lineb[2] = lineb[1];
	lineb[1] = lineb[0];
	lineb[0] = line;
});