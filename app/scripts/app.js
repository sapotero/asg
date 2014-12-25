'use strict';

/**
 * @ngdoc overview
 * @name reportApp
 * @description
 * # reportApp
 *
 * Main module of the application.
 */
angular
  .module('reportApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',  
    'highcharts-ng',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/debit', {
        templateUrl: 'views/debit.html',
        controller: 'DebitCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
