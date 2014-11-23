'use strict';

var exec = require('child_process').exec;
var async = require('async');
var datejs = require('datejs');
var fs = require('fs');

// Loading cities file
var cities = JSON.parse(fs.readFileSync('cities.json'));

var data = {};

var citiesLength = 3;
var routes = [];
//var citiesLength = Object.keys(cities).length;
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

async.eachLimit(routes, 2, function(route, done) {
    var origin = route.origin;
    var dest = route.dest;
    var cmd = 'phantomjs sbb.js ' + origin + ' ' + dest +
        ' \'' + Date.today().toString('dd.MM.yyyy') + '\'';
    exec(cmd, function(err, stdout, stderr) {
        try {
            data[origin][dest] = JSON.parse(stdout);
        } catch (e) {
            data[origin][dest] = stdout;
        } finally {
            done();
        }
    });
}, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Complete');
        fs.writeFileSync('dump.json', JSON.stringify(data));
    };
});


return;
// var prc =

// while (!allDone) {}