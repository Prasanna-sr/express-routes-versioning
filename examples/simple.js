var app = require('express')();
var routesVersioning = require('../index')();
app.listen(3000);

app.get('/test', routesVersioning({
   "^1.0.0": respondV1,
   "~2.2.1": respondV2
}, versionNotMatched));

function respondV1(req, res, next) {
   res.status(200).send('ok v1');
}

function respondV2(req, res, next) {
   res.status(200).send('ok v2');
}

function versionNotMatched(req, res, next) {
    res.status(404).send('not found');
}
