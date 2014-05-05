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
        templateUrl: 'views/announcementcase.html',
        controller: 'AnnouncementcaseCtrl'
      })
      .when('/AnnouncementCase', {
        templateUrl: 'views/announcementcase.html',
        controller: 'AnnouncementcaseCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
