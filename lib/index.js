const MapWrap = require("./MapWrap");

module.exports = function(key, cacheSize=10) {
  return new MapWrap(key, cacheSize)
}