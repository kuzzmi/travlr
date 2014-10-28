var exec = require('child_process').exec;
var fs = require('fs');
var cities = JSON.parse(fs.readFileSync('cities.json'));

var data = {};

var citiesLength = 10;
var allDone = false;

for (var i = 0; i <= citiesLength; i++) {
    for (var j = i + 1; j <= citiesLength; j++) {
        if (i !== j) {
            (function(_i, _j) {
                if (!data[_i])
                    data[_i] = {};
                var prc = exec('phantomjs sbb.js ' + _i + ' ' + _j,
                    function(err, stdout, stderr) {
                        console.log(JSON.stringify(data));
                        console.log(_i, _j);

                        try {
                            data[_i][_j] = JSON.parse(stdout);
                        } catch (e) {
                            data[_i][_j] = stdout;
                        }
                        fs.writeFileSync('dump.json', JSON.stringify(data));
                    });
            })(i, j);
        }
    };
};

// while (!allDone) {}