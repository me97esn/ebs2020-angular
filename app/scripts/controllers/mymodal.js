'use strict';

angular.module('ebs2020AngularApp')
  .controller('MyModalCtrl', function ($scope, myModal) {
    this.closeMe = myModal.deactivate;
  });
