const express = require("express");
const mysqlconnection = require("./connection");
const router = express.Router();

router.get("/",(request,response)=>{
    mysqlconnection.query("select user,host from mysql.user",(err, rows, fields)=>{
        if (!err)
        {
            response.send(rows);
        } else {
            console.log("Error executing query");
            throw err;
        }
    })
});

module.exports = router;