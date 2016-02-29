# Express routes versioning

[![Build Status](https://travis-ci.org/Prasanna-sr/express-routes-versioning.svg?branch=master)](https://travis-ci.org/Prasanna-sr/express-routes-versioning) [![Coverage Status](https://coveralls.io/repos/github/Prasanna-sr/express-routes-versioning/badge.svg?branch=master)](https://coveralls.io/github/Prasanna-sr/express-routes-versioning?branch=master)


Simple node.js module provides versioning for expressjs routes/api.

## Install
`npm install express-routes-versioning`

## Usage

Follows semver versioning format. Supports '^, ~' symbols for matching version numbers.

```
    var app = require('express')();
    var routesVersioning = require('express-routes-versioning')();
    app.listen(3000);

    app.get('/test', routesVersioning({
       "^1.0.0": respondV1,
       "~2.2.1": respondV2
    }));

    // All versions starting with 1.* matches this function
    function respondV1(req, res, next) {
       res.status(200).send('ok v1');
    }
    // All versions starting with 2.2.* matches this function
    function respondV2(req, res, next) {
       res.status(200).send('ok v2');
    }
```
This might appear as an anti pattern considering how npm versioning works, where client controls the version. Here server could control the version of the client, assuming client trust the server fully. Typically the client and server belong to the same company in these cases.

**API**

`routesVersioning(Options, NoMatchFoundCallback)`

**Options** - object, containing version in semver format (supports ^,~ symbols as key and function callback (as a connect middleware) to invoke when the request matches the version as value. Note: Versions are expected to be mutually exclusive, as order of execution of the version couldn't be determined.

**NoMatchFoundCallback** (optional)- called if request version doesn't match the version provided in the options. If not provided latest version is called.
- **How version is determined for each request ?**

    Default behaviour is to use `accept-version` headers from the client.

    This can be overridden by using a middleware and providing version in `req.version` property.

- **What format of versioning is supported ?**

    semver versioning is supported. Simple version format like 1, 1.1 can also be passed which is converted to semver versioning.
    Note: '^,~' symbols are not supported while passing the version from the client.

- **How versions are matched ?**

    semver versioning is used to match version if versions are provided in semver format else direct mapping is used (for versions like 1, 1.1)

    If no versions are matched, default behaviour is to map most recent version, if `NoMatchFoundCallback` is specified then that would be called instead.


## Examples

Examples are available [here](https://github.com/Prasanna-sr/express-routes-versioning/tree/master/examples)

## Test

`npm test`
