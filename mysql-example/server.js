const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");

const offenderroutes = require("./offender");
const mysqlconnection = require("./connection");

var app = express();

app.use(bodyparser.json());
app.use("/offender", offenderroutes); //direct it to people modeule (people.js)

app.listen(3000);