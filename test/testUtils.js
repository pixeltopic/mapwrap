function requireConfig() {
  try {
    return require("./config");
  }
  catch (e) {
    console.log("config.js not found. Create config.js in test/ exporting an object\n`{ GOOGLE_API_KEY: \"your Google Maps API key\" }`\n");
    return {};
  }
}

exports.requireConfig = requireConfig;

exports.mapwrapDefaultConfig = function() {
  return {
    DEFAULT_API_KEY: requireConfig().GOOGLE_API_KEY || null,
    logCache: true, 
  };
}