// required to take input from user
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const SSH = require('simple-ssh');

// parser to parse the data(separated by tabs and spaces)
const parser = require('node-csv-parse');

// function to get input from user
function getInput() {

	rl.question("What is the host? ", function(host) {
	    rl.question("What is the user? ", function(user) {
	    	rl.question("What is the password? ", function(password) {

	    		ssh(host, user ,password);
	   		rl.close();

	    	});
	    });
	});
}

// function to ssh into a remote host.
function ssh(host, user ,password){

	console.log('inside the system')
	var ssh_options = new SSH({
	    host: host,
	    user: user,
	    pass: password
	});
	// execute the df -h command to find out disk utilization
	ssh_options.exec('df -h', {
	    out: function(stdout) {
	        parse(stdout);
	    }
	}).start();
}

// Threshold value to see if disk utilization is below or above the desired limit.
const threshold = 90;
// function to parse the raw data from the df -h command.
function parse(data){

	// the parser function takes the data that needs to be parsed as the input and returns the parsed data as the output.
	// the delimiter specifies how the data is separated into columns. For example, if there is a '-' separating the columns in the
	// data, then the delimiter would be '-'. In this case, there is a space(' ') separating the columns. Hence, the delimiter is ' '
	// The trim value specifies whether the extra spaces in the data needs to be removed or not.
	var parsed = parser(data, {
		delimiter: ' ',
		trim: true
	}).asRows();

	var finalData = [];

	// go through every row in the data and add another column for threshold.
	// Also, check to see if CPU utilization percentage has exceeded threshold or not.
	for(var i = 0; i < parsed.length; i++){
		// Split the data based on space so that we get the individual columns.
		var temp = parsed[i][0].split(' ');

		// remove all the empty spaces in the array
		temp = temp.filter(function(str) {
			// This line removes all the empty spaces in the array
    			return /\S/.test(str);
		});

		// If this is the first record, then it is the column header. Therefore, for the column header, we need to add another column
		// called Threshold exceeded? which tells us whether the limit has exceeded or not.
		if(i == 0){
			temp.pop();
			temp.push('Threshold exceeded?');
		}
		// If this is not the first row, then we can check to see if it has exceeded the threshold or not.
		else{
			if(parseInt(temp[4]) >= threshold){
				temp.push('YES');
			}
			else{
				temp.push('NO');
			}
		}
		finalData.push(temp);
	}

	// Print the final data as a neat table on the terminal
	console.table(finalData);
}

function main(){
	getInput();
}

main();