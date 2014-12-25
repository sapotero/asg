'use strict';

describe('Controller: DebitCtrl', function () {

  // load the controller's module
  beforeEach(module('reportApp'));

  var DebitCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DebitCtrl = $controller('DebitCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
