const mysql = require("mysql");
var mysqlconnection = mysql.createConnection({
    host : "localhost",
    port : "5644",
    database : "carl",
    user : "root",
    password : "delta1",
    multipleStatements : true
});

mysqlconnection.connect((err) => {
    if (!err)
    {
        console.log("DB CONNECTION ESTABLISHED - Listening on port 3000");
    } else {
        console.log("CONNECTION FAILED");
        throw err;
    }
});

module.exports = mysqlconnection;