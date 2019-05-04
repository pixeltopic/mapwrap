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

(async () => {
  try {

    const geoWrapper = await mapwrap.geocode("Staples Center, LA");
    console.log(geoWrapper.getAllAddresses()); // return an array of objects
    console.log(geoWrapper.getTopAddress()); // return first address in its object
    console.log(geoWrapper.getTopAddress(true)); // return first address as a string

    const reverseGeoWrapper = await mapwrap.reverseGeocode(33.651021, -117.841550);
    console.log(reverseGeoWrapper.getAllAddresses());
    console.log(reverseGeoWrapper.getTopAddress());
    console.log(reverseGeoWrapper.getTopAddress(true));

    /*
    Allowed modes: https://developers.google.com/maps/documentation/directions/intro#TravelModes
    */
    const directionsParams = {
      origin: "Anaheim", // required
      destination: "Irvine", // required
      mode: "driving",
      altRoutes: true, // false by default. retrieve alternate routes (up to 3, usually)
      avoidFerries: false,
      avoidHighways: false,
      avoidIndoor: false,
      avoidTolls: false,
      units: "imperial" // or "metric"
    };

    const directionsWrapper = await mapwrap.directions(directionsParams);

    /* 
    The methods getStartAddress, getEndAddress, getRoute, and getRouteSteps
    accepts an optional number to specify which route you want to retrieve data from.
    Useful only when altRoutes is set to true in directionsParams.
    Defaults to 0 if not specified.
    */
    console.log(directionsWrapper.getStartAddress(1));
    console.log(directionsWrapper.getEndAddress()); 
    console.log(directionsWrapper.getRoute(1)); 
    console.log(directionsWrapper.getRoutes());
    console.log(directionsWrapper.getRouteSteps());

    const placeSearchWrapper = await mapwrap.nearbySearchPlaces({
      location: {
        lat: 33.651021, 
        lng: -117.841550
      },
      radius: 30,
      keyword: "starbucks", // optional
      units: "imperial" // or "metric"
    });

    console.log(placeSearchWrapper.getResults());
    /*
    What is next page token?
    https://developers.google.com/places/web-service/search#PlaceSearchPaging
    */
    console.log(placeSearchWrapper.getNextPageToken());

    /* 
    commented out as Google Maps API requires a small amount of time before the next page token becomes valid.
    https://stackoverflow.com/questions/21265756/paging-on-google-places-api-returns-status-invalid-request

    const placeSearchWrapper2 = await mapwrap.additionalPlaces(placeSearchWrapper.getNextPageToken());
    */

    const placeDetailsObject = await mapwrap.placeDetails("ChIJN1t_tDeuEmsRUsoyG83frY4");

    console.log(placeDetailsObject);

  } catch (err) {
    console.log(err);
  }
  
})();

```

If any bugs are found, please don't hesitate to open an issue on the project repo. I'll do my best to address them.