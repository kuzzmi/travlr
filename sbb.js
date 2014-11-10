var page = require('webpage').create();
var fs = require('fs');
var url = 'https://www.sbb.ch/ticketshop/b2c/adw.do?4092';
var stepIndex = 0;
var needsToDefine = false;
var system = require('system');
var args = system.args;
var origin = args[1],
    dest = args[2];

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments:
 * the string for the message, the line number, and the source identifier.
 */
page.onConsoleMessage = function(msg, line, source) {
    console.log(msg);
};

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript alert. The only argument passed to the callback is the string for the message.
 */
page.onAlert = function(msg) {
    console.log('  alert > ' + msg);
};

page.onError = function(msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    })
}

// Callback is executed each time a page is loaded...
page.open(url, function(status) {
    if (status === 'success') {
        page.injectJs('//code.jquery.com/jquery-1.11.0.min.js');
    } else {
        console.log("Status: " + status);
        phantom.exit();
    }
});

page.onLoadFinished = function(status) {
    // Save screenshot
    // for debugging purposes
    var exit = false;
    if (status === 'success') {
        switch (stepIndex) {
            case 0:
                enterFrom();
                break;
            case 1:
                enterTo();
                break;
            case 2:
                goToNextPage();
                break;
            case 3:
                getPrices();
                exit = true;
                break;
        }
        page.render("step" + stepIndex+++".png");
        if (exit) {
            phantom.exit();
        }
    }
};

// Step 1
function enterFrom() {
    page.evaluate(function() {
        document.getElementById('inputDatum').value = '11.11.2014';
        document.querySelector("[name='artikelspez.abgang.method:cityOption']").click();
    });
}

// Step 2
function enterTo() {
    page.evaluate(function() {
        document.querySelector("[name='artikelspez.bestimmung.method:cityOption']").click();
    });
}

// Step 3
function goToNextPage() {
    page.evaluate(function(origin, dest) {
        document.getElementById('von-drop').value = +origin;
        document.getElementById('nach-drop').value = +dest;
        document.querySelector("[name='method:cont']").click();
    }, origin, dest);
}

// Step 4
function getPrices() {
    page.evaluate(function() {
        var options = document.querySelectorAll('.base.unit.lastUnit');
        // console.log(options.length);
        if (options.length === 3) {

            var getPropertiesWithPrefix = function(obj, prefix) {
                var result = {};

                for (var k in obj) {
                    if (k.indexOf(prefix) === 0) {
                        result[
                            k.replace(prefix + '-', '').toLowerCase()
                        ] = obj[k];
                    }
                }

                return result;
            };

            var class2 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_2');
            var class1 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_1');

            var prices = {
                class1: {
                    einfach: getPropertiesWithPrefix(class1, 'einfach'),
                    retour: getPropertiesWithPrefix(class1, 'retour')
                },
                class2: {
                    einfach: getPropertiesWithPrefix(class2, 'einfach'),
                    retour: getPropertiesWithPrefix(class2, 'retour')
                }
            };
            console.log(JSON.stringify(prices));
        } else {
            var optionsRaw = [];
            for (var i = 0; i < options.length; i++) {
                optionsRaw.push(parseFloat(options[i].innerText.replace('ab CHF', '')));
            }
            console.log(optionsRaw);
        }
    });
}