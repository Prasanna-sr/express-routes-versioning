var express = require('express');
var app = express();
var router = express.Router();
app.use(router);
app.listen(3000);

var routesVersioning = require('../index')();

router.get('/test', routesVersioning({
   "^1.0.0": respondV1,
   "^2.2.1": respondV2,
   "3.0.0": respondV3,
}, versionNotMatched));


function versionNotMatched(req, res, next) {
    res.status(404).send('not found');
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
