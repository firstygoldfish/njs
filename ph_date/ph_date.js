// PNJ PROJECT ph_date 
// Do we need to check for valid date???
phdate = '11/12/2022';

phdate = phdate.replaceAll('/','');

phdate = phdate.substr(4,4) + phdate.substr(2,2) + phdate.substr(0,2);

console.log(phdate);
