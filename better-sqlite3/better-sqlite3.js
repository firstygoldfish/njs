import Database from "better-sqlite3";

function dbquery() {
	let row = null;
	try {
		row = db.prepare('SELECT count(*) as count from user_data').get();
	} catch (err) { console.log(' ' + err);  return; }
	console.log(row.count + ' records in table');
}
function dbupdate() {
	let row = null;
	try {
		row = db.prepare('update user_data set username = username where username=\'OASYS_ADMIN\'').run();
	} catch (err) { console.log(' ' + err);  return; }
	console.log(row.changes + ' records updated');
}
function dbinsert() {
	let row = null;
	try {
		row = db.prepare('insert into user_data (username, area, sessionid, url) values (\'CARL\',\'ESSEX\',\'123456\',\'www.msn.com\')').run();
	} catch (err) { console.log(' ' + err);  return; }
	console.log(row.changes + ' records inserted');
	dbquery();
}
function dbdelete() {
	let row = null;
	try {
		row = db.prepare('delete from user_data where username = \'CARL\'').run();
	} catch (err) { console.log(' ' + err);  return; }
	console.log(row.changes + ' records deleted');
	dbquery();
}
function dbiterate() {
	let stmt = null;
	try {
		stmt = db.prepare('SELECT * from user_data');
	} catch (err) { console.log(' ' + err);  return; }
	for (const row of stmt.iterate()) {
		console.log(row.username + ' - ' + row.area)
	}
}


const db = new Database('launcharndb.sqlite');
if (db) { console.log('Database opened'); } else { console.log('DB ERROR - Datbase NOT available'); }

dbquery();
dbupdate();
dbinsert();
dbiterate();
dbdelete();
dbiterate();