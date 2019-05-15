const Joi = require("joi");

const DEFAULT_MAX_AGE = 300000; // 5 minutes or 300,000 ms
const DEFAULT_CACHE_SIZE = 10; // hold 10 items by default

module.exports = Joi.object().keys({
  DEFAULT_API_KEY: Joi.string().required().error(new Error("Default Google Maps API Key required.")),

  useRestrictedKeys: Joi.object().keys({
    GEOCODING_API_KEY: Joi.string().default(null),
    DIRECTIONS_API_KEY: Joi.string().default(null),
    PLACES_API_KEY: Joi.string().default(null)
  }).default({}),
  
  logCache: Joi.boolean().default(false),
  logger: Joi.func().default(console.log), // if not specified, defaults to console.log
  
  cacheMaxItemAges: Joi.object().keys({
    reverseGeoCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(DEFAULT_MAX_AGE),
    geoCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(DEFAULT_MAX_AGE),
    directionsCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(DEFAULT_MAX_AGE),
    nearbySearchCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(DEFAULT_MAX_AGE),
    placeDetailsCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(DEFAULT_MAX_AGE)
  }).default({
    reverseGeoCache: DEFAULT_MAX_AGE,
    geoCache: DEFAULT_MAX_AGE,
    directionsCache: DEFAULT_MAX_AGE,
    nearbySearchCache: DEFAULT_MAX_AGE,
    placeDetailsCache: DEFAULT_MAX_AGE,
  }), 
  cacheMaxSizes: Joi.object().keys({
    reverseGeoCache: Joi.number().min(1).integer().default(DEFAULT_CACHE_SIZE),
    geoCache: Joi.number().min(1).integer().default(DEFAULT_CACHE_SIZE),
    directionsCache: Joi.number().min(1).integer().default(DEFAULT_CACHE_SIZE),
    nearbySearchCache: Joi.number().min(1).integer().default(DEFAULT_CACHE_SIZE),
    placeDetailsCache: Joi.number().min(1).integer().default(DEFAULT_CACHE_SIZE)
  }).default({
    reverseGeoCache: DEFAULT_CACHE_SIZE,
    geoCache: DEFAULT_CACHE_SIZE,
    directionsCache: DEFAULT_CACHE_SIZE,
    nearbySearchCache: DEFAULT_CACHE_SIZE,
    placeDetailsCache: DEFAULT_CACHE_SIZE,
  })
});