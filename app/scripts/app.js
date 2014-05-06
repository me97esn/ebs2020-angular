'use strict';

angular.module('ebs2020AngularApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/listcases.html',
        controller: 'ListcasesCtrl'
      })
      .when('/AnnouncementCase/:caseId', {
        templateUrl: 'views/announcementcase.html',
        controller: 'AnnouncementcaseCtrl'
      })
      .when('/listCases', {
        templateUrl: 'views/listcases.html',
        controller: 'ListcasesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
