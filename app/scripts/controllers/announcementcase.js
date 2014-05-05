'use strict';

angular.module('ebs2020AngularApp')
  .controller('AnnouncementcaseCtrl', function ($scope, Restapi) {
    var caseid = 24461;
    $scope.announcementCase = new Restapi.DataModel({id:caseid, module: 'AnnouncementCase'});
    $scope.announcementCase.fetch();
  });
