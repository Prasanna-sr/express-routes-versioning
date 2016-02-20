function routesVersioning() {
   return function(args) {
      return function(req, res, next) {
         var that = this;
         var version = getVersion(req);

         if (typeof(args) === 'object') {
            if (require('util').isArray(args)) {

            } else {
               if (!version) {
                  var key = findLatestVersion(Object.keys(args));
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
               //get the latest version when no version match found
               var key = findLatestVersion(Object.keys(args));
               args[key].call(that, req, res, next);
            }
         } else {
            console.log('Input has to be either an object or array');
         }
      }
   }
}

/**
* Given an array of versions, returns the latest version.
* Follows semver versioning rules.
* Supports version types: 1, 1.0, 0.1, 1.0.0
* Note: 1 is treated as 1.0.0
**/
function findLatestVersion(versions) {
   var valueTable = {};
   var maxTotal;
   for (var i = 0; i < versions.length; i++) {
      var key = versions[i];
      //handles these type of version '1', '1.0', '1.0.0'
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
   maxTotal = Math.max.apply(Math, Object.keys(valueTable));
   return valueTable[maxTotal];
}
/**
* Gets the version of the application either from accept-version headers
* or req.version property
**/
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
