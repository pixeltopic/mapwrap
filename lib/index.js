const MapWrap = require("./MapWrap");

/**
 * Wrapper for several Google API services including Directions, Geocoding, and Places with built in LRU caching.
 * @constructor
 * @param {Object} config - Object to configure MapWrap instance.
 * @param {String} config.DEFAULT_API_KEY - Google API Key to be used. If a key was restricted to a certain service, you must use `useRestrictedKeys`.
 * @param {Object} config.useRestrictedKeys - Alternative option to DEFAULT_API_KEY.
 * @param {String} config.useRestrictedKeys.GEOCODING_API_KEY - API key for Geocoding API services.
 * @param {String} config.useRestrictedKeys.DIRECTIONS_API_KEY - API key for Directions API services.
 * @param {String} config.useRestrictedKeys.PLACES_API_KEY - API key for Places API services.
 * @param {Boolean} [config.logCache] - enables logging of messages when an item is retrieved from each LRU cache. `false` by default.
 * @param {Number} [config.reverseGeoCacheSize] - specify max size of reverse geocoding cache. 10 by default.
 * @param {Number} [config.geoCacheSize] - specify max size of geocoding cache. 10 by default.
 * @param {Number} [config.directionsCacheSize] - specify max size of directions cache. 10 by default.
 * @param {Number} [config.nearbySearchCacheSize] - specify max size of nearby search cache. 10 by default.
 * @param {Number} [config.placeDetailsCacheSize] - specify max size of place details cache. 10 by default.
 */
module.exports = function(config) {
  return new MapWrap(config);
}