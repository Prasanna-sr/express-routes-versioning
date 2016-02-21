var routesVersioning = require('./../index')();
var assert = require('assert');

describe('routes versioning', function() {
    it('calling routesVersioning should ' +
    'return connect style middleware', function() {
        var middleware = routesVersioning();
        assert.equal(typeof(middleware), 'function');
    });
});
