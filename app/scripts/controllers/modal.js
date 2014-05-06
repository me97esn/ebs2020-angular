'use strict';

angular.module('ebs2020AngularApp')
  .controller('ModalCtrl', function ($scope, myModal) {
    this.showModal = myModal.activate;
    // this.showModal = function(){
    // 	console.log('show modal');
    // };
  });
