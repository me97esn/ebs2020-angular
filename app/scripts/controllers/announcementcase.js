'use strict';

angular.module('ebs2020AngularApp')
	.controller('AnnouncementcaseCtrl', function($scope, Restapi, Settings, Formeditors) {
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
			success: function() {
				$scope.displaySchemas();
			},
			error: function(err) {
				// Could not find schema, try with the default
				$scope.schemaModel.valueTwo = 'default';
				$scope.schemaModel.fetch({
					success: function() {
						$scope.displaySchemas();
						// Found schema!
					},
					error: function(err) {
						// Could not find schema, no more to try
					}
				});
			}.bind(this)
		});

		$scope.displaySchemas = function() {
			$scope.$digest();

			if ($scope.schemaModel && $scope.schemaModel.get('schemas')) {
				var schemaModelJson = ($scope.schemaModel.toJSON()).schemas;

				schemaModelJson.forEach(function(schemaItem, idx) {
					addContent(schemaItem, idx);
				});

				$('form > fieldset > div.form-group > div > span > :input').addClass('form-control'); // Only add the class to the main form elements
				$('#view-form-shema-container label:empty').hide(); // Remove empty labels
				$('.help-inline, .help-block').remove(); // Remove unnecessary code. :)

				$('[data-label]').each(function() {
					var label = ' ' + $(this).attr('data-label');

					$(this).wrap('<label />');
					$(this).parent().append(label);
				});

				$('[data-modify="inline"]').each(function() {
					var $this = $(this).parent().parent().parent();

					$this.find('label:first').removeClass('col-sm-6');
					$this.find('label:first').addClass('col-sm-12');

					$this.find('div:first').removeClass('col-sm-6');
					$this.find('div:first').addClass('col-sm-12');
				});
			}
		}

		function addContent(schema, schemaIndex) {
			if (schema.module) {
				return;
			}

			var schemaJson = schema;

			console.log('Displaying schema :', schemaJson.schema);

			var form = new Backbone.Form({
				model: $scope.announcementCase,
				schema: schemaJson.schema
			});
			form.render()
			console.log('rendered form: ', form.el);
			$('body').append(form.el);
		}


		function _addContent(schema, schemaIndex) {
			if (schema.module) {
				return;
			}

			var schemaJson = schema;

			var form = new Backbone.Form({
				model: $scope.announcementCase,
				schema: schemaJson.schema
			});

			function submitForm() {
				var errors = form.commit();
				if (!errors) {
					form.model.changedAttributes() && form.model.save();
				} else {
					console.warn('Errors:' + JSON.stringify(errors));
				}
			}

			var newRegion = 'new-region-' + schemaIndex;

			var title = schemaJson.title ? schemaJson.title : '[MISSING TITLE]';

			$('#view-form-shema-container').append('<div><fieldset><legend>' + title + '</legend><div id="' + newRegion + '" /></fieldset></div>');

			that.addRegion(newRegion, '#' + newRegion);
			that[newRegion].show(form);

			$('main :input:not(:checkbox):not(:radio):not(select)').on('blur', submitForm);
			$('main :checkbox').on('click', submitForm);
			$('main :radio').on('click', submitForm);
			$('main select').on('change', submitForm);
		}


	});