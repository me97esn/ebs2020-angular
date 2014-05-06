'use strict';

describe('Controller: AuthLoginHtmlCtrl', function () {

  // load the controller's module
  beforeEach(module('ebs2020AngularApp'));

  var AuthLoginHtmlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AuthLoginHtmlCtrl = $controller('AuthLoginHtmlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
