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
		// Bind parameters on prepare
		row = db.prepare('update user_data set username = username where username=?').bind('OASYS_ADMIN').run();
	} catch (err) { console.log(' ' + err);  return; }
	console.log(row.changes + ' records updated');
}
function dbinsert() {
	let row = null;
	try {
		const stmt = db.prepare('insert into user_data (username, area, sessionid, url) values (?,?,?,?)');
		// Bind parameters on run
		let res = stmt.run('CARL','ESSEX','123456','www.msn.com');
		console.log(res.changes + ' records inserted');
		res = stmt.run('CARL','KENT','987654','www.google.com');
		console.log(res.changes + ' records inserted');
	} catch (err) { console.log(' ' + err);  return; }
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
		console.log(row.username + ' - ' + row.area);
	}
}
function columns() {
	let stmt = null;
	let cols = null;
	try {
		stmt = db.prepare('SELECT * from user_data');
	} catch (err) { console.log(' ' + err);  return; }
	console.log(stmt.columns().length + ' Columns');
	for (const col of stmt.columns()) {
		if (cols == null) { cols = col.name + '|'; }
		if (cols != null)  { cols = cols + col.name + '|'; }
	}
	console.log(cols);
}
function columns2() {
	let stmt = null;
	let cols = null;
	try {
		stmt = db.prepare('SELECT * from user_data');
	} catch (err) { console.log(' ' + err);  return; }
	let columns = stmt.columns();
	for (const row of stmt.iterate()) {
		let dbdata = null;
		for (const col of columns) {
			if (dbdata != null) dbdata = dbdata + eval('row.' + col.name) + '|';
			if (dbdata == null) dbdata = eval('row.' + col.name) + '|';
			//if (dbdata == null) dbdata = '[' + col.name + ']' + eval('row.' + col.name) + ' ';
			//if (dbdata != null) dbdata = dbdata + '[' + col.name + ']' + eval('row.' + col.name) + ' ';
		}
		console.log(dbdata);
	}
}

const db = new Database('launcharndb.sqlite');
if (db) { console.log('Database opened'); } else { console.log('DB ERROR - Datbase NOT available'); }

console.log('**QUERY**');
dbquery();
console.log('**UPDATE**');
dbupdate();
console.log('**INSERT**');
dbinsert();
console.log('**ITERATE**');
dbiterate();
console.log('**DELETE**');
dbdelete();
console.log('**COLUMN QUERIES**');
columns();
columns2();