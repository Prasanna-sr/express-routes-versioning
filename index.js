function routesVersioning() {
   return function(args) {
      return function(req, res, next) {
         var that = this;
         var version = getVersion(req);

         if (typeof(args) === 'object') {
            if (require('util').isArray(args)) {

            } else {
               if (!version) {
                  var key = findLatestVersion(args);
                  console.log(key);
                  args[key].call(that, req, res, next);
                  return;
               }
               var keys = Object.keys(args);
               for (var i = 0; i < keys.length; i++) {
                  var key = keys[i];
                  if (key === version) {
                     args[key].call(that, req, res, next);
                     return;
                  }
               }
            }
         } else {
            console.log('Input has to be either an object or array');
         }
      }
   }
}

function findLatestVersion(args) {
   var valueTable = {};
   var maxTotal;
   var keys = Object.keys(args);
   for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      //hadnles these type of version '1', '1.0', '1.0.0'
      var values = key.split('.');
      var total = 0;
      for (var j = 0; j < values.length; j ++) {
          var no = Number(values[j]);
          if(!isNaN(values[j])) {
              if(j === 0) {
                total = total + no * 1000;
            } else if (j === 1) {
                total = total + no * 100;
            } else {
                total = total + no;
            }
          } else {
              break;
          }
      }
      valueTable[total] = key;
   }
   console.log(valueTable);
   maxTotal = Math.max.apply(Math, Object.keys(valueTable));
   return valueTable[maxTotal];
}

function getVersion(req) {
   var version;
   if (!req.version) {
      if (req.headers && req.headers['accept-version']) {
         version = req.headers['accept-version'];
      }
   } else {
      version = req.version;
   }
   return version;
}

module.exports = routesVersioning;
