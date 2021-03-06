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

// if prod is false, tests the MapWrap code in lib. If true, tests the babel-compiled code in dist.
exports.selectEnvTest = (prod = false) => {
  if (prod) {
    return require("../index");
  } else {
    return require("../lib");
  }
}