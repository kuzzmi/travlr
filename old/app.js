'use strict';

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var async = require('async');
var datejs = require('datejs');
var fs = require('fs');

// Loading cities file
var cities = JSON.parse(fs.readFileSync('cities.json'));

var data = {};

// var citiesLength = 3;
var routes = [];
var citiesLength = 3;//10;//100; //Object.keys(cities).length;
//console.log(citiesLenght);

for (var i = 0; i <= citiesLength; i++) {
    for (var j = i + 1; j <= citiesLength; j++) {
        if (i !== j) {
            if (!data[i])
                data[i] = {};
            data[i][j] = {};

            routes.push({
                origin: i,
                dest: j
            });
        }
    };
};

var getData = function(route, done) {
    var origin = route.origin;
    var dest = route.dest;
    console.log(JSON.stringify(route) + ' started');

    var cmd = './get.sh ' + origin + ' ' + dest + ' 23.01.2015';
    // console.log(cmd);

    var getsh = exec(cmd, function(err, stdout, stderr) {
        if (err || stderr) {
            console.log(JSON.stringify(route) + ' error');
            getsh.kill();
            done();
        }
        try {
            data[origin][dest] = JSON.parse(stdout);
        } catch (e) {
            console.log(route, ' error: ' + e);
            data[origin][dest] = stdout;
        } finally {
            console.log(JSON.stringify(route) + ' completed');
            getsh.kill();
            done();
        }
    });
};

var getDataSpawn = function(route, done) {
    var origin = route.origin;
    var dest = route.dest;
    console.log(JSON.stringify(route) + ' started');
    var params = [origin, dest, '21.01.2015'];
    
    var getsh = spawn('./get.sh', params);
    getsh.stdout.setEncoding('utf8');
    getsh.stdout.on('data', function(stdout){
        try {
            data[origin][dest] = JSON.parse(stdout);
        } catch (e) {
            console.log(route, ' error: ' + e);
            data[origin][dest] = stdout;
        }
    });
    getsh.on('close', function() {
        console.log(JSON.stringify(route) + ' completed');
        done();
        
    });  
};

var dumpData = function(err) {
    if (err) {
        console.log(err);
    } else {
        var ended = new Date();
        var diff = (ended.getTime() - started.getTime()) / 1000;
        console.log('Complete on ' + ended + '. Completed in ' + diff + ' sec');
        fs.writeFileSync('dump.json', JSON.stringify(data));
    };
};

var started = new Date();
async.eachLimit(routes, 10, getDataSpawn, dumpData);
