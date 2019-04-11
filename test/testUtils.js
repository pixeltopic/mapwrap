exports.requireConfig = function() {
  try {
    return require("./config");
  }
  catch (e) {
    console.log("config.js not found. Create config.js in test/ exporting an object\n`{ GOOGLE_API_KEY: \"your Google Maps API key\" }`\n");
    return {};
  }
}