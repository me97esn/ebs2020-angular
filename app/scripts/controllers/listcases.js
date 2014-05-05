'use strict';

angular.module('ebs2020AngularApp')
  .controller('ListcasesCtrl', function ($scope, Restapi) {
    $scope.cases = Restapi.listAnnouncementCases.query();
  });
