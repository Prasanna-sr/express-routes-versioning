var routesVersioning = require('./../index')();
var assert = require('assert');
var sinon = require('sinon');

describe('routes versioning', function() {
   var req;
   var res;
   var next;
   beforeEach(function() {
      req = {};
      res = {};
      next = function() {};
   });
   it('calling routesVersioning should ' +
      'return connect style middleware',
      function() {
         var middleware = routesVersioning({});
         assert.equal(typeof(middleware), 'function');
      });
   it('calling routesVersioning with invalid input, ' +
      'should thrown an error',
      function() {
         assert.equal(routesVersioning([]), -1);
         assert.equal(routesVersioning(null), -1);
         assert.equal(routesVersioning(''), -1);
      });

   it('if version if not provided by client, ' +
      'and NoMatchFoundCallback is provided, ' +
      'it should be called',
      function() {
         var NoMatchFoundSpy = sinon.spy();
         var middleware = routesVersioning({}, NoMatchFoundSpy);
         middleware(req, res, next);
         assert.ok(NoMatchFoundSpy.calledOnce);
         assert.ok(NoMatchFoundSpy.calledWith(req, res, next));
      });

   it('if version if not provided by client, ' +
      'and NoMatchFoundCallback is not provided, ' +
      'latest version callback should be called',
      function() {
         var latestVersionSpy = sinon.spy();
         var middleware = routesVersioning({
            "1.2.1": sinon.spy(),
            "1.3.1": latestVersionSpy
         });
         middleware(req, res, next);
         assert.ok(latestVersionSpy.calledOnce);
         assert.ok(latestVersionSpy.calledWith(req, res, next));
      });

});
