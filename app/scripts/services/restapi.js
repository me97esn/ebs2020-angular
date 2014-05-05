'use strict';

angular.module('ebs2020AngularApp')
  .service('Restapi', function Restapi() {
  	this.BaseModel = Backbone.AssociatedModel.extend({
            /******
            * Note, do not override this method unless you're absolutely certain about what you're doing!
            * A safer way is to implement the onInit method on your models.
            */
            initialize: function (attributes) {
                if (this.beforeInit) {
                    this.beforeInit(attributes);
                }
                Backbone.Model.prototype.initialize.call(this, arguments);

                if (!this.id) {
                    this.id = '-1';
                }

                this.originalSave = this.save;

                this.save = function (key, val, options) {
                    // TODO this should be removed?
                    if (this.id === '-1') {
                        delete this.id;
                    }

                    this.originalSave(key, val, options);
                };

                this.idAttribute = 'id';
                this.revAttribute = '_rev';

                this.ioBind('serverdelete', conosleIo.socketio, this.doTheFetch);
                this.ioBind('servercreate', conosleIo.socketio, this.doTheFetch);
                this.ioBind('serverupdate', conosleIo.socketio, this.doTheFetch);

                if (attributes) {
                    this.id = attributes[this.idAttribute] || attributes.id || attributes._id; // We always want to use 'id' as our it attribute
                }

                if (this.onInit) {
                    this.onInit(attributes);
                }
            },

            doTheFetch: function () {
                console.log('do the fetch ♫♪♩♫♬');
                this.fetch({
                    reset: true,
                    success: function () {
                        console.debug('SocketIO - Model - Fetched: ', this);
                    }.bind(this)
                });
            }
        });
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
