function routesVersioning() {
   return function(args, notFoundMiddleware) {
      return function(req, res, next) {
         var that = this;
         var version = getVersion(req);

         if (typeof(args) === 'object') {
            if (require('util').isArray(args)) {
                //When input is of type Array
            } else {
                //When input is of type Object
                var keys = Object.keys(args);
                var key;
                var tempKey;
                var versionArr;
                var tempVersion;
               if (!version) {
                   if(notFoundMiddleware) {
                       notFoundMiddleware.call(that, req, res, next);
                   } else {
                       key = findLatestVersion(keys);
                       args[key].call(that, req, res, next);
                   }
                   return;
               }

               for (var i = 0; i < keys.length; i++) {
                  key = keys[i];
                   versionArr = version.split('.');
                  if (key[0] === '~') {
                      tempKey = key.substr(1);
                      tempKey = tempKey.split('.').slice(0,2).join('.');
                      tempVersion = versionArr.slice(0, 2).join('.');
                  } else if (key[0] === '^') {
                      tempKey = key.substr(1);
                      tempKey = tempKey.split('.').slice(0,1).join('.');
                      tempVersion = versionArr.slice(0, 1).join('.');
                  } else {
                      tempKey = key;
                      tempVersion = version;
                  }
                  if (tempKey === tempVersion) {
                     args[key].call(that, req, res, next);
                     return;
                  }
               }
               if (notFoundMiddleware) {
                   notFoundMiddleware.call(that, req, res, next);
               } else {
                   //get the latest version when no version match found
                   key = findLatestVersion(keys);
                   args[key].call(that, req, res, next);
               }
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
      if (key[0] === '^' || key[0] === '~') {
          key = key.substr(1);
      }
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
