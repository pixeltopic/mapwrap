const Joi = require("joi");

const types = ["accounting", "airport", "amusement park", "aquarium", "art gallery",
  "atm", "bakery", "bank", "bar", "beauty salon", "bicycle store", "book store",
  "bowling alley", "bus station", "cafe", "campground", "car dealer", "car rental", "car repair", 
  "car wash", "casino", "cemetery", "church", "city hall", "clothing store", "convenience store",
  "courthouse", "dentist", "department store", "doctor", "electrician", "electronics store",
  "embassy", "fire station", "florist", "funeral home", "furniture store",
  "gas station", "gym", "hair care", "hardware store", "hospital", "jewelry store", "laundry",
  "lawyer", "library", "liquor store", "local government office",
  "locksmith", "lodging", "movie theater", "museum", "night club",
  "park", "parking", "pet store", "pharmacy", "police", "post office", "restaurant",
  "school", "shoe store", "shopping mall", "spa", "stadium", "store", "subway station", 
  "supermarket", "train station", "transit station", "veterinary care", "zoo"
];

module.exports = Joi.object().keys({ 
  location: Joi.object().keys({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).required(),
  radius: Joi.number().min(0).required(),
  units: Joi.string().lowercase().valid(["imperial", "metric"]), 
  keyword: Joi.string(), 
  type: Joi.string().lowercase().valid(types),
  minprice: Joi.number().min(-1).max(4), 
  maxprice: Joi.number().min(-1).max(4)
});