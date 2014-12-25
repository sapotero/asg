'use strict';

/**
 * @ngdoc function
 * @name reportApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the reportApp
 */
angular.module('reportApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
