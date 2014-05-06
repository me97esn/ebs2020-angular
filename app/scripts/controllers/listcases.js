'use strict';

angular.module('ebs2020AngularApp')
  .controller('ListcasesCtrl', function ($scope, Restapi) {
    $scope.cases = Restapi.listAnnouncementCases.query();
    $scope.createAnnouncement = function(){
    	// https://localhost:4000/restapi/FlowEngineREST/new/CREATE_ANNOUNCEMENT/AnnouncementCase/25250
    	console.log('TODO: create it');
    }
  });
