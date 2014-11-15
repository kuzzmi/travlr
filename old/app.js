'use strict';

var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');

// Loading cities file
var cities = JSON.parse(fs.readFileSync('cities.json'));

var data = {};

var citiesLength = 3;
var asyncStack = [];
//var citiesLength = Object.keys(cities).length;
//console.log(citiesLenght);

for (var i = 0; i <= citiesLength; i++) {
    for (var j = i + 1; j <= citiesLength; j++) {
        if (i !== j) {
            if (!data[i])
                data[i] = {};
            data[i][j] = {};

            asyncStack.push(function(callback) {
                (function(_i, _j) {
                    exec('phantomjs sbb.js ' + _i + ' ' + _j,
                        function(err, stdout, stderr) {
                            console.log(JSON.stringify(data));
                            console.log(_i, _j);

                            try {
                                data[_i][_j] = JSON.parse(stdout);
                            } catch (e) {
                                data[_i][_j] = stdout;
                            }

                            callback();
                        })
                })(i, j);
            });
        }
    };
};

async.eachLimit(asyncStack, 2, function(item, done) {
    console.log('start');
    item(function() {
        console.log('done');
        done();
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