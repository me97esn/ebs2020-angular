'use strict';

angular.module('ebs2020AngularApp')
  .factory('myModal', function(btfModal) {
    return btfModal({
      controller: 'MyModalCtrl',
      controllerAs: 'modal',
      templateUrl: 'views/my-modal.html'
    });
  });