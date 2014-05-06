'use strict';

describe('Controller: MymodalCtrl', function () {

  // load the controller's module
  beforeEach(module('ebs2020AngularApp'));

  var MymodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MymodalCtrl = $controller('MymodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
