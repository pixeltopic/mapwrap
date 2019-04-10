const Joi = require("joi");

module.exports = Joi.object().keys({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  mode: Joi.string().lowercase().valid(["driving", "bicycling", "transit", "walking"]),
  units: Joi.string().lowercase().valid(["imperial", "metric"]),
  altRoutes: Joi.boolean(),
  avoidFerries: Joi.boolean(),
  avoidHighways: Joi.boolean(),
  avoidIndoor: Joi.boolean(),
  avoidTolls: Joi.boolean()
})