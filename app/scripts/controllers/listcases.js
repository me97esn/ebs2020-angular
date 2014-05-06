'use strict';

angular.module('ebs2020AngularApp')
  .controller('ListcasesCtrl', function ($scope, Restapi, $http, $location) {
    $scope.cases = Restapi.listAnnouncementCases.query();

    $scope.createAnnouncement = function(){
    	$http.post('/restapi/EntityREST/AnnouncementCase', {className: "se.esf.ebs2020.entity.announcement.AnnouncementCase"}).success(function(response){
    		$http.put('/restapi/FlowEngineREST/new/CREATE_ANNOUNCEMENT/AnnouncementCase/' + response.id, response).success(function(){
    			console.log('TODO goto announcement');
    			$location.path('/AnnouncementCase/' + response.id);
    		})
    	});
    }
  });
