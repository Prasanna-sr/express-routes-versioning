# Express routes versioning
Simple node.js module provides semver versioning for expressjs routes/api.

## Install
`npm install express-routes-versioning`

## Usage
    var app = require('express')();
    var routesVersioning = require('express-routes-versioning')();
    app.listen(3000);

    app.get('/test', routesVersioning({
       "^1.0.0": respondV1,
       "~2.2.1": respondV2
    }));

    function respondV1(req, res, next) {
       res.status(200).send('ok v1');
    }

    function respondV2(req, res, next) {
       res.status(200).send('ok v2');
    }

* **How version is determined ?**

    Default behaviour is to use `accept-version` headers from the client.
    This can be overridden by specifying version in `req.version` property.

* **What format of versioning is supported ?**

    semver versioning is supported. Simple version number can also be passed which is converted to semver versioning.

* **How versions are matched ?**

    semver versioning is used to match version if versions are provided in semver format else direct mapping is used (for versions like 1, 1.1)
    If no versions are matched, default behaviour is to map most recent version, if `NoMatchFoundParameter` is specified then that would be called instead.
## Examples

## Test
