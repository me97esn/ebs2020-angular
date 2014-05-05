'use strict';

angular.module('ebs2020AngularApp')
	.service('Settings', function Settings() {
			// AngularJS will instantiate a singleton by calling "new" on this function
			var restUrl = '/restapi/';

			var applicationName;

			applicationName = 'internal';

			function getRestUrl(api) {
				return restUrl + api;
			}

			function getEntityUrl() {
				return restUrl + 'EntityREST/' + Array.prototype.join.call(arguments, '/');
			}

			function getRestCollectionUrl(api) {
				return restUrl + 'collection/' + api;
			}

			function getFlowUrl() {
				return restUrl + 'FlowEngineREST/new/' + Array.prototype.join.call(arguments, '/');
			}

			function getRawFlowUrl() {
				return restUrl + 'FlowEngineREST/' + Array.prototype.join.call(arguments, '/');
			}

			function getTranslateUrl() {
				return restUrl + 'translate/' + Array.prototype.join.call(arguments, '/');
			}

			this.applicationName = applicationName
			this.getRestUrl = getRestUrl
			this.getRestCollectionUrl = getRestCollectionUrl
			this.getEntityUrl = getEntityUrl
			this.getFlowUrl = getFlowUrl
			this.getRawFlowUrl = getRawFlowUrl
			this.getTranslateUrl = getTranslateUrl
		})