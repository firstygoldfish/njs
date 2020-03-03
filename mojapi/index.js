// Load app server with express
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

//app.use(morgan('combined'));

app.get('/', (request,response) => {
    response.send('Hello from NodeJS root');
});

app.get('/offenders', (request,response) => {
    var offenderData = require('./offender');
    var keys = getKeys(offenderData);
    var match = 0;
    var result;
    // Check for match
    for (var i=0; i < offenderData.length; i++) {
        for (var j=0; j < keys.length; j++) {
            var key = keys[j];
            var value = offenderData[i].values[j];
            if (request.query[key] == offenderData[i].values[j] || (request.query[key] == undefined && value == null)) { 
                match++;
            }
            if (match == keys.length) { 
                result = offenderData[i].response;
                break; // Found a match so exit this for
            } 
        }
        if (result) { break; } // Found a match so exit this for
        match = 0; // Reset match   
    }
    if (result) {
        response.send(result);
    } else {
        response.send({ "STATUS" : "NOT FOUND" });
    }
    
});

app.listen(3000, () => {
    console.log('Node server is up and running');
});

function getKeys(data) {
    return(data[0].keys);
}