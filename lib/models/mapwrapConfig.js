const Joi = require("joi");

module.exports = Joi.object().keys({
  DEFAULT_API_KEY: Joi.string().required().error(new Error("Default Google Maps API Key required.")),

  useRestrictedKeys: Joi.object().keys({
    GEOCODING_API_KEY: Joi.string().default(null),
    DIRECTIONS_API_KEY: Joi.string().default(null),
    PLACES_API_KEY: Joi.string().default(null)
  }).default({}),
  
  logCache: Joi.boolean().default(false),

  reverseGeoCacheSize: Joi.number().min(1).integer().default(10),
  geoCacheSize: Joi.number().min(1).integer().default(10),
  directionsCacheSize: Joi.number().min(1).integer().default(10),
  nearbySearchCacheSize: Joi.number().min(1).integer().default(10),
  placeDetailsCacheSize: Joi.number().min(1).integer().default(10)
});