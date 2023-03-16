// PNJ PROJECT checkchar 
const fs = require('fs');

fs.readFile('OFFENDER_RSR_SCORES_PKG.pkb', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  for (let i = 0; i < data.length; i++)
  {
		if ( (data.charCodeAt(i) < 31 && data.charCodeAt(i) != 10 && data.charCodeAt(i) != 13) || data.charCodeAt(i) > 126)
		{
			console.log('POS='+i+' - ascii='+data.charCodeAt(i)+'- char='+data[i]);
		}
  }
  //console.log(data.replaceAll(String.fromCharCode(9),'[HTAB]'));
});