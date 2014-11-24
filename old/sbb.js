var page = require('webpage').create();
var fs = require('fs');
var url = 'https://www.sbb.ch/ticketshop/b2c/adw.do?4092';
var stepIndex = 0;
var system = require('system');
var args = system.args;
var origin = args[1],
    dest = args[2],
    date = args[3];

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
    });
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
                var exit = getPrices();
                break;
            case 4:
                var exit = getPrices();
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
    page.evaluate(function(date) {
        document.getElementById('inputDatum').value = date;
        document.querySelector("[name='artikelspez.abgang.method:cityOption']").click();
    }, date);
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
    var toExit = page.evaluate(function(step) {
        var options = document.querySelectorAll('.base.unit.lastUnit');
        if (options.length <= 3) {
            var prices;
            var class1;
            var class2;

            var getPropertiesWithPrefix = function(obj, prefix) {
                var result = {};

                for (var k in obj) {
                    if (k.indexOf(prefix) === 0) {
                        result[k.replace(prefix + '-', '').toLowerCase()] = obj[k];
                    }
                }

                return result;
            };

            if (step === 3) {
                class2 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_2');
                class1 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_1');

                class1Einfach = getPropertiesWithPrefix(class1, 'einfach');
                class1Retour = getPropertiesWithPrefix(class1, 'retour');
                class2Einfach = getPropertiesWithPrefix(class2, 'einfach');
                class2Retour = getPropertiesWithPrefix(class2, 'retour');

                prices = {
                    class1: {
                        full: {
                            oneWay: class1Einfach[0],
                            roundTrip: class1Retour[0]
                        },
                        half: {
                            oneWay: class1Einfach[1],
                            roundTrip: class1Retour[1]
                        },
                        child: {
                            oneWay: class1Einfach[3],
                            roundTrip: class1Retour[3]
                        }
                    },
                    class2: {
                        full: {
                            oneWay: class2Einfach[0],
                            roundTrip: class2Retour[0]
                        },
                        half: {
                            oneWay: class2Einfach[1],
                            roundTrip: class2Retour[1]
                        },
                        child: {
                            oneWay: class2Einfach[3],
                            roundTrip: class2Retour[3]
                        }
                    }
                };
            } else {
                class2 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_2-');
                class1 = getPropertiesWithPrefix(ticketPriceMap, 'KLASSE_1-');

                prices = {
                    class1: {
                        full: {
                            dayPass: class1[0],
                        },
                        half: {
                            dayPass: class1[1]
                        }
                    },
                    class2: {
                        full: {
                            dayPass: class2[0],
                        },
                        half: {
                            dayPass: class2[1]
                        }
                    }
                };
            }
            console.log(JSON.stringify(prices));
            return true;
        } else {
            var optionsRaw = [];
            var sortedArray = [];

            for (var i = 0; i < options.length; i++) {
                optionsRaw.push(parseFloat(options[i].innerText.replace('ab CHF', '')));
            }

            sortedArray = optionsRaw.slice().sort(function(a, b) {
                return a - b;
            });

            function click(el) {
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent(
                    'click',
                    true /* bubble */ , true /* cancelable */ ,
                    window, null,
                    0, 0, 0, 0, /* coordinates */
                    false, false, false, false, /* modifier keys */
                    0 /*left*/ , null
                );
                el.dispatchEvent(ev);
            }

            var lowestIndex = optionsRaw.indexOf(sortedArray[0]);

            var element = document.querySelector('[name="billettauswahl.pakete[' +
                lowestIndex + '].method:select"]');

            click(element);
            return false;
        }
    }, stepIndex);

    return toExit;
}