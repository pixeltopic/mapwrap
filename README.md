# MapWrap :pushpin:

[![npm version](https://badge.fury.io/js/mapwrap.svg)](https://badge.fury.io/js/mapwrap) ![npm bundle size](https://img.shields.io/bundlephobia/min/mapwrap.svg)

## About

MapWrap is a simple wrapper around the Google Maps API for Geocoding, Directions, and Places (Nearby Search, Place Details). It provides simple methods to access data members in the API response with error checking.

MapWrap also implements a simple LRU cache to speed up requests and decrease the amount of unnecessary calls to the server. It is fully compliant with Google's restriction of not caching data for over 30 days.

## Installation
```
npm install --save mapwrap
```

## Usage

```js
const MapWrap = require("mapwrap");

const mapwrap = MapWrap({
  DEFAULT_API_KEY: "my_google_api_key", 
  useRestrictedKeys: {
    GEOCODING_API_KEY: "geocoding_api_key", // optional keys with priority over default for specific API services
    DIRECTIONS_API_KEY: "directions_api_key", // these are null by default.
    PLACES_API_KEY: "places_api_key"
  }, 
  reverseGeoCacheSize: 20, // set the size of your LRU cache (all cache sizes are 10 by default)
  geoCacheSize: 20, 
  directionsCacheSize: 15, 
  nearbySearchCacheSize: 10, 
  placeDetailsCacheSize: 10,
  logCache: true // prints a message when the cache is accessed. (false by default)
});

const geocode = async () => {
  const payload = await mapwrap.geocode("Staples Center, LA");
  return payload.getAllAddresses();
}

const directions = async params => {
  const payload = await mapwrap.directions(params);
  return payload;
}

let payload = await directions({ 
  origin: "Anaheim", 
  destination: "Irvine", 
  mode: "driving" 
});
 
console.log(payload.getStartAddress());

```
Usage documentation will be updated to be more thorough in the future. For more usage examples, they can be found in the test folder on the Github repo.

If any bugs are found, please don't hesitate to open an issue on the project repo. I'll do my best to address them.
