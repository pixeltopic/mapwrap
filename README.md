## MapWrap :pushpin:

### About
---
MapWrap is a simple wrapper around the Google Maps API for Geocoding, Directions, and Places (Nearby Search, Place Details). It provides simple methods to access data members in the API response with error checking.

MapWrap also implements a simple LRU cache to speed up requests and decrease the amount of unnecessary calls to the server. It is fully compliant with Google's restriction of not caching data for over 30 days.

### Usage
---
```js
const MapWrap = require("mapwrap");
const mapwrap = MapWrap("My Google Maps API key");

async () => {
  const payload = await mapwrap.geocode("Staples Center, LA");
  return payload.getAllAddresses();
}
```