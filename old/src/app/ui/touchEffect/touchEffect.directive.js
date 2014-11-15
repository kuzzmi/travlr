'use strict';

angular.module('travlr.UI.TouchEffect', [])
    .directive('touchEffect', function($interval) {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, $element, iAttrs, controller) {
                $element.on('click', function(event) {
                    var size = 10;
                    var x = event.offsetX - 5;
                    var y = event.offsetY - 5;
                    $element.addClass('touched');
                    $element.css({
                        'background-position-x': x + 'px',
                        'background-position-y': y + 'px',
                        'background-size': size + 'px'
                    });
                    var elementWidth = $element[0].clientWidth;
                    var sizeStep = 12;
                    var interval = $interval(function() {
                        x -= sizeStep;
                        y -= sizeStep;
                        size += sizeStep * 2;

                        $element.css({
                            'background-position-x': x + 'px',
                            'background-position-y': y + 'px',
                            'background-size': size + 'px'
                        });

                        if (size >= elementWidth * 2) {
                            $element.removeClass('touched');
                            $interval.cancel(interval);
                        }
                    }, 10);
                })
            }
        };
    });