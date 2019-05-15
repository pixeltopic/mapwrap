const Joi = require("joi");

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
    reverseGeoCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(300000),
    geoCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(300000),
    directionsCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(300000),
    nearbySearchCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(300000),
    placeDetailsCache: Joi.number().min(60000).max(30 * 24 * 60 * 60 * 1000).default(300000)
  }).default({}), 
  cacheMaxSizes: Joi.object().keys({
    reverseGeoCache: Joi.number().min(1).integer().default(10),
    geoCache: Joi.number().min(1).integer().default(10),
    directionsCache: Joi.number().min(1).integer().default(10),
    nearbySearchCache: Joi.number().min(1).integer().default(10),
    placeDetailsCache: Joi.number().min(1).integer().default(10)
  }).default({})
});