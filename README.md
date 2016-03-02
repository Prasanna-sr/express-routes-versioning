# Express routes versioning

[![Build Status](https://travis-ci.org/Prasanna-sr/express-routes-versioning.svg?branch=master)](https://travis-ci.org/Prasanna-sr/express-routes-versioning) [![Coverage Status](https://coveralls.io/repos/github/Prasanna-sr/express-routes-versioning/badge.svg?branch=master)](https://coveralls.io/github/Prasanna-sr/express-routes-versioning?branch=master)
[![npm version](https://badge.fury.io/js/express-routes-versioning.svg)](http://badge.fury.io/js/express-routes-versioning)


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
       "1.0.0": respondV1,
       "~2.2.1": respondV2
    }));

    // curl -s -H 'accept-version: 1.0.0' localhost:3000/test
    // version 1.0.0 or 1.0 or 1 !
    function respondV1(req, res, next) {
       res.status(200).send('ok v1');
    }

    //curl -s -H 'accept-version: 2.2.0' localhost:3000/test
    //Anything from 2.2.0 to 2.2.9
    function respondV2(req, res, next) {
       res.status(200).send('ok v2');
    }
```
Supporting '^,~' on server might appear as an anti-pattern considering how npm versioning works, where client controls the version. Here server controls the version (or it may not), and client fully trust the server. Typically the client and server belong to the same organization in these cases.

**API**

`routesVersioning(Options, NoMatchFoundCallback)`

**Options** - object, containing version in semver format (supports ^,~ symbols) as key and function callback (connect middleware format) to invoke when the request matches the version as value. Note: Versions are expected to be mutually exclusive, as order of execution of the version couldn't be determined.

**NoMatchFoundCallback** (optional)- called if request version doesn't match the version provided in the options. If this callback is not provided latest version callback is called.


**How version is determined for each request ?**

Default behaviour is to use `accept-version` headers from the client.

This can be overridden by using a middleware and providing version in `req.version` property.

**How versions are matched ?**

semver versioning format is used to match version if versions are provided in semver format, supports ^,~ symbols on the server, else direct mapping is used (for versions like 1, 1.1)

## Examples

Examples are available [here](https://github.com/Prasanna-sr/express-routes-versioning/tree/master/examples)

## Test

`npm test`
