'use strict';

describe('Service: myModal', function () {

  // load the service's module
  beforeEach(module('ebs2020AngularApp'));

  // instantiate service
  var myModal;
  beforeEach(inject(function (_myModal_) {
    myModal = _myModal_;
  }));

  it('should do something', function () {
    expect(!!myModal).toBe(true);
  });

});
