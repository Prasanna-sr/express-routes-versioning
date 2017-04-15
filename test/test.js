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

   it('if version is not provided by client, ' +
      'and NoMatchFoundCallback if provided is called',
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

      it('if accept-version header is present, ' +
         'appropriate callback should be called',
         function() {
             var version1Spy = sinon.spy();
             var version2Spy = sinon.spy();
            var middleware = routesVersioning({
               "1.2.1": version1Spy,
               "1.3.1": version2Spy
            });
            req.headers = {};
            req.headers["accept-version"] = "1.2.1";
            middleware(req, res, next);
            assert.ok(version1Spy.calledOnce);
            assert.ok(version1Spy.calledWith(req, res, next));
         });
   it('when multiple version are provided, ' +
      'matching version should be called',
      function() {
         var version1Spy = sinon.spy();
         var version2Spy = sinon.spy();
         var middleware = routesVersioning({
            "1.2.1": version1Spy,
            "2.3.1": version2Spy
         });
         req.version = "2.3.1";
         middleware(req, res, next);
         assert.ok(version2Spy.calledOnce);
         assert.ok(version2Spy.calledWith(req, res, next));
         assert.ok(version1Spy.neverCalledWith(req, res, next));
      });
   it('when multiple version are provided, and no matching version found ' +
      'NoMatchFoundCallback is called',
      function() {
         var version1Spy = sinon.spy();
         var version2Spy = sinon.spy();
         var NoMatchFoundSpy = sinon.spy();
         var middleware = routesVersioning({
            "1.2.1": version1Spy,
            "2.3.1": version2Spy
         }, NoMatchFoundSpy);
         req.version = "2.3.2";
         middleware(req, res, next);
         assert.ok(NoMatchFoundSpy.calledOnce);
         assert.ok(NoMatchFoundSpy.calledWith(req, res, next));
      });
   it('when multiple version are provided, and no matching version found ' +
      'latest version is called, if NoMatchFoundCallback is not provided',
      function() {
         var version1Spy = sinon.spy();
         var version2Spy = sinon.spy();
         var middleware = routesVersioning({
             "2.0.2": sinon.spy(),
             "~2.3.0": sinon.spy(),
            "1.2.1": version1Spy,
            "2.0.0": sinon.spy(),
            "~1.4.4": sinon.spy(),
            "1.22.0": sinon.spy(),
            "2.3.1": version2Spy,
            "null": sinon.spy()
         });
         req.version = "1.3.2";
         middleware(req, res, next);
         assert.ok(version2Spy.calledOnce);
         assert.ok(version2Spy.calledWith(req, res, next));
      });
   it('when ^ is used in version, version should matching appropriately',
      function() {
         var version1Spy = sinon.spy();
         var version2Spy = sinon.spy();
         var middleware = routesVersioning({
            "^1.2.1": version1Spy,
            "2.3.1": version2Spy
         });
         req.version = "1.4.2";
         middleware(req, res, next);
         assert.ok(version1Spy.calledOnce);
         assert.ok(version1Spy.calledWith(req, res, next));
      });
      it('when ~ is used in version, version should matching appropriately',
         function() {
            var version1Spy = sinon.spy();
            var version2Spy = sinon.spy();
            var middleware = routesVersioning({
               "~1.2.1": version1Spy,
               "2.3.1": version2Spy
            });
            req.version = "1.2.9";
            middleware(req, res, next);
            assert.ok(version1Spy.calledOnce);
            assert.ok(version1Spy.calledWith(req, res, next));
         });
         it('when ~ is used in version, version should matching appropriately, '+
         'if doesnt match, highest version should be called',
            function() {
               var version1Spy = sinon.spy();
               var version2Spy = sinon.spy();
               var middleware = routesVersioning({
                  "~1.2.1": version1Spy,
                  "2.3.1": version2Spy
               });
               req.version = "1.3.9";
               middleware(req, res, next);
               assert.ok(version2Spy.calledOnce);
               assert.ok(version2Spy.calledWith(req, res, next));
            });
    it('when version provided as integer, version should cast to string',
      function() {
         var version1Spy = sinon.spy();
         var middleware = routesVersioning({
            "1": version1Spy,
         });
         req.version = 1;
         middleware(req, res, next);
         assert.ok(version1Spy.calledOnce);
         assert.ok(version1Spy.calledWith(req, res, next));
      });
});
