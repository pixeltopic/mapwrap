const Joi = require("joi");

module.exports = Joi.object().keys({
  DEFAULT_API_KEY: Joi.string().error(new Error("Google Maps API Key required.")),

  useRestrictedKeys: Joi.object().keys({
    GEOCODING_API_KEY: Joi.string().required(),
    DIRECTIONS_API_KEY: Joi.string().required(),
    PLACES_API_KEY: Joi.string().required()
  }).default({}),
  
  logCache: Joi.boolean().default(false),

  reverseGeoCacheSize: Joi.number().min(1).integer().default(10),
  geoCacheSize: Joi.number().min(1).integer().default(10),
  directionsCacheSize: Joi.number().min(1).integer().default(10),
  nearbySearchCacheSize: Joi.number().min(1).integer().default(10),
  placeDetailsCacheSize: Joi.number().min(1).integer().default(10)
}).xor("DEFAULT_API_KEY", "useRestrictedKeys");