const MapWrap = require("./MapWrap");

/**
 * Wrapper for several Google API services including Directions, Geocoding, and Places with built in LRU caching.
 * Factory method returning a new instance of MapWrap with specified config.
 * 
 * @param {Object} config - Object to configure MapWrap instance.
 * @param {String} config.DEFAULT_API_KEY - Google API Key to be used. If a key was restricted to a certain service, you must use `useRestrictedKeys`.
 *
 * @param {Object} [config.useRestrictedKeys] - Alternative option to DEFAULT_API_KEY.
 * @param {String} [config.useRestrictedKeys.GEOCODING_API_KEY] - API key for Geocoding API services.
 * @param {String} [config.useRestrictedKeys.DIRECTIONS_API_KEY] - API key for Directions API services.
 * @param {String} [config.useRestrictedKeys.PLACES_API_KEY] - API key for Places API services.
 *
 * @param {Boolean} [config.logCache] - enables logging of messages when an item is retrieved from each LRU cache. `false` by default.
 * @param {Function} [config.logger] - Specify a custom logger function to render any messages the instance will produce. `console.log` bu default.
 *
 * @param {Object} [config.cacheMaxItemAges] - object containing configuration to set a custom max item age for each cache in ms. Cannot be under 1 minute or over 30 days.
 * @param {Number} [config.cacheMaxItemAges.reverseGeoCache] - specify max item age of reverse geocoding cache in ms. 300000 by default.
 * @param {Number} [config.cacheMaxItemAges.geoCache] - specify max item age of geocoding cache in ms. 300000 by default.
 * @param {Number} [config.cacheMaxItemAges.directionsCache] - specify max item age of directions cache in ms. 300000 by default.
 * @param {Number} [config.cacheMaxItemAges.nearbySearchCache] - specify max item age of nearby search cache in ms. 300000 by default.
 * @param {Number} [config.cacheMaxItemAges.placeDetailsCache] - specify max item age of place details cache in ms. 300000 by default.
 *
 * @param {Object} [config.cacheMaxSizes] - object containing configuration to set a custom size for each cache.
 * @param {Number} [config.cacheMaxSizes.reverseGeoCache] - specify max size of reverse geocoding cache. 10 by default.
 * @param {Number} [config.cacheMaxSizes.geoCache] - specify max size of geocoding cache. 10 by default.
 * @param {Number} [config.cacheMaxSizes.directionsCache] - specify max size of directions cache. 10 by default.
 * @param {Number} [config.cacheMaxSizes.nearbySearchCache] - specify max size of nearby search cache. 10 by default.
 * @param {Number} [config.cacheMaxSizes.placeDetailsCache] - specify max size of place details cache. 10 by default.
 */
const MapWrapInit = config => {
  return new MapWrap(config);
};

module.exports = MapWrapInit;
