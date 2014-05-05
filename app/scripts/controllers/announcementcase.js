'use strict';

angular.module('ebs2020AngularApp')
	.controller('AnnouncementcaseCtrl', function($scope, Restapi, Settings) {
		console.log('TODO: Read id from url, here is hard coded');
		var caseid = 24461;
		$scope.announcementCase = new Restapi.DataModel({
			id: caseid,
			module: 'AnnouncementCase'
		});
		$scope.announcementCase.fetch();

		$scope.schemaModel = new Restapi.SchemaModel({
			id: caseid,
			module: 'AnnouncementGeneralSection',
			valueTwo: Settings.applicationName
		})
		$scope.schemaModel.fetch({
			success: function(){
				$scope.$digest();
			},
			error: function(err) {
				// Could not find schema, try with the default
				$scope.schemaModel.valueTwo = 'default';
				$scope.schemaModel.fetch({
					success: function() {
						$scope.$digest();
						// Found schema!
					},
					error: function(err) {
						// Could not find schema, no more to try
					}
				});
			}.bind(this)
		});
	});