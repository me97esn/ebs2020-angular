'use strict';

angular.module('ebs2020AngularApp')
	.service('Restapi', function Restapi(Settings, $resource, $rootScope) {
		var self = this;
		var settings = Settings;

		this.listAnnouncementCases = $resource('/restapi/EntityREST/AnnouncementCase?query=FindAcCaseidName');

		
			var socket = io.connect('//localhost:4000');

			socket.on('connect', function() {
				// socket connected
			});

			socket.on('custom event', function() {
				// server emitted a custom event
			});

			socket.on('disconnect', function() {
				// socket disconnected
			});

			socket.send('hi there :)');

			this._socketio = socket;
		

		this.BaseModel = Backbone.AssociatedModel.extend({
			/******
			 * Note, do not override this method unless you're absolutely certain about what you're doing!
			 * A safer way is to implement the onInit method on your models.
			 */
			initialize: function(attributes) {
				if (this.beforeInit) {
					this.beforeInit(attributes);
				}
				Backbone.Model.prototype.initialize.call(this, arguments);

				if (!this.id) {
					this.id = '-1';
				}

				this.originalSave = this.save;

				this.save = function(key, val, options) {
					// TODO this should be removed?
					if (this.id === '-1') {
						delete this.id;
					}

					this.originalSave(key, val, options);
				};

				this.idAttribute = 'id';
				this.revAttribute = '_rev';
				console.log('TODO: add ioBind to model!');

				// this.ioBind('serverdelete', self._socketio, this.doTheFetch);
				// this.ioBind('servercreate', self._socketio, this.doTheFetch);
				// this.ioBind('serverupdate', self._socketio, this.doTheFetch);

				if (attributes) {
					this.id = attributes[this.idAttribute] || attributes.id || attributes._id; // We always want to use 'id' as our it attribute
				}

				if (this.onInit) {
					this.onInit(attributes);
				}
			},

			doTheFetch: function() {
				console.log('♫♪♩♫♬ do the fetch ♫♪♩♫♬');
				this.fetch({
					reset: true,
					success: function() {
						console.debug('SocketIO - Model - Fetched: ', this);
						$rootScope.$digest();
						this.fetched = new Date();
					}.bind(this)
				});
			}
		});
		this.SchemaModel = this.BaseModel.extend({

			url: function() {
				if (this.valueTwo) {
					return settings.getRestUrl('ComponentSchemaREST?valueOne=' + this.module + '&valueTwo=' + this.valueTwo + '&caseId=' + this.id);
				} else if (this.id) {
					return settings.getRestUrl('ComponentSchemaREST?valueOne=' + this.module + '&valueTwo=default');
				} else {
					return settings.getRestUrl('ComponentSchemaREST/' + this.module);
				}
			},

			initialize: function(options) {
				this.module = options.module;
				this.id = options.id;
				this.valueTwo = options.valueTwo;
			}
		});


		this.DataModel = this.BaseModel.extend({
			url: function() {
				if (this.id) {
					return settings.getRestUrl('EntityREST/' + (this.module || this.get('module')) + '/' + this.id);
					//return settings.getRestUrl('EntityREST/AnnouncementCase/' + this.announcementId + '/' + this.module + '/' + this.id);
				} else {
					return settings.getRestUrl('EntityREST/' + (this.module || this.get('module')));
				}
			}
		});
		// AngularJS will instantiate a singleton by calling "new" on this function
	});