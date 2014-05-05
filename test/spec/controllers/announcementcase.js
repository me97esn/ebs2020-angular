'use strict';

describe('Controller: AnnouncementcaseCtrl', function () {

  // load the controller's module
  beforeEach(module('ebs2020AngularApp'));

  var AnnouncementcaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnouncementcaseCtrl = $controller('AnnouncementcaseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
