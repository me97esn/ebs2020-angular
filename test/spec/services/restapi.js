'use strict';

describe('Service: Restapi', function () {

  // load the service's module
  beforeEach(module('ebs2020AngularApp'));

  // instantiate service
  var Restapi;
  beforeEach(inject(function (_Restapi_) {
    Restapi = _Restapi_;
  }));

  it('should do something', function () {
    expect(!!Restapi).toBe(true);
  });

});
