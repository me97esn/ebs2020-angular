'use strict';

describe('Service: Formeditors', function () {

  // load the service's module
  beforeEach(module('ebs2020AngularApp'));

  // instantiate service
  var Formeditors;
  beforeEach(inject(function (_Formeditors_) {
    Formeditors = _Formeditors_;
  }));

  it('should do something', function () {
    expect(!!Formeditors).toBe(true);
  });

});
