var express = require('express');
var app = express();
var router = express.Router();
app.use(router);
app.listen(3000);

var routesVersioning = require('../index')();

// req.version would be used for versioning
router.use(function(req, res, next) {
    req.version = '3.0.0';
    next();
});
router.get('/test', routesVersioning({
   "^1.0.0": respondV1,
   "^2.2.1": respondV2,
   "3.0.0": respondV3,
}, versionNotMatched));


function versionNotMatched(req, res, next) {
    res.status(404).send('version not found');
}

function respondV1(req, res, next) {
   res.status(200).send('ok v1');
}

function respondV2(req, res, next) {
   res.status(200).send('ok v2');
}

function respondV3(req, res, next) {
   res.status(200).send('ok v3');
}
