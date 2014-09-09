'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.sortable',
  'ui.bootstrap.transition',
  'ui.bootstrap.modal',
  'ui.bootstrap.tabs'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/analysis', {templateUrl: '/static/partials/analysis/analysis.html', controller: 'AnalysisCtrl'});
  $routeProvider.otherwise({redirectTo: '/analysis'});
  $locationProvider.html5Mode(true);
}]);
