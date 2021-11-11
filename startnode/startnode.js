// PNJ PROJECT startnode 
/*-----------------------------------IMPORTS----------------------------------*/
import fs      from "fs"
/*--------------------------------CONFIGURATION-------------------------------*/

/*-----------------------------CORE FUNCTIONS---------------------------------*/
function badFile() {
			console.log('ERROR:Cannot load JSON file '+jsonfile);
			process.exit(1);
}
function loadJSON(filename = '') {
	return JSON.parse(fs.existsSync(filename) ? fs.readFileSync(filename).toString() : badFile() );
}
/*-----------------------------CORE RUNTIME---------------------------------*/
var currdir=process.cwd()+'\\..\\';
fs.readdirSync(currdir).filter(function (file) {
if (fs.statSync(currdir+'/'+file).isDirectory()) {
	console.log(file);
};
});

