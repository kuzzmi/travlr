var async = require('async');
var citiesLength = 5;
var items = [];

var fn = function(item, cb) {
    setTimeout(function() {
        console.log(item);
        cb();
    }, 1000);
};

for (var i = 0; i <= citiesLength; i++) {
    for (var j = i + 1; j <= citiesLength; j++) {
        items.push(i + ' ' + j);
    }
}

async.eachLimit(items, 3, function(item, done) {
    fn(item, function() {
        done();
    });
}, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Complete');
    };
});