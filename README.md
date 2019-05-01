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

If any bugs are found, please don't hesitate to open an issue on the project repo. I'll do my best to address them.

## Method Documentation

* [MapWrap](#MapWrap)
    * [new MapWrap(config)](#new_MapWrap_new)
    * [.geocode(address)](#MapWrap+geocode) ⇒ <code>GeoWrapper</code>
    * [.reverseGeocode(lat, lng)](#MapWrap+reverseGeocode) ⇒ <code>ReverseGeoWrapper</code>
    * [.directions(params)](#MapWrap+directions) ⇒ <code>DirectionsWrapper</code>
    * [.nearbySearchPlaces(params)](#MapWrap+nearbySearchPlaces) ⇒ <code>PlaceSearchWrapper</code>
    * [.additionalPlaces(nextPageToken)](#MapWrap+additionalPlaces) ⇒ <code>PlaceSearchWrapper</code>
    * [.placeDetails(placeId)](#MapWrap+placeDetails) ⇒ <code>Object</code>

<a name="new_MapWrap_new"></a>

### new MapWrap(config)
constructor to configure MapWrap


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Object to configure MapWrap instance. |
| config.DEFAULT_API_KEY | <code>String</code> | Google API Key to be used. If a key was restricted to a certain service, you must use `useRestrictedKeys`. |
| [config.useRestrictedKeys] | <code>Object</code> | Alternative option to DEFAULT_API_KEY. |
| [config.useRestrictedKeys.GEOCODING_API_KEY] | <code>String</code> | API key for Geocoding API services. |
| [config.useRestrictedKeys.DIRECTIONS_API_KEY] | <code>String</code> | API key for Directions API services. |
| [config.useRestrictedKeys.PLACES_API_KEY] | <code>String</code> | API key for Places API services. |
| [config.logCache] | <code>Boolean</code> | enables logging of messages when an item is retrieved from each LRU cache. `false` by default. |
| [config.reverseGeoCacheSize] | <code>Number</code> | specify max size of reverse geocoding cache. 10 by default. |
| [config.geoCacheSize] | <code>Number</code> | specify max size of geocoding cache. 10 by default. |
| [config.directionsCacheSize] | <code>Number</code> | specify max size of directions cache. 10 by default. |
| [config.nearbySearchCacheSize] | <code>Number</code> | specify max size of nearby search cache. 10 by default. |
| [config.placeDetailsCacheSize] | <code>Number</code> | specify max size of place details cache. 10 by default. |

<a name="MapWrap+geocode"></a>

### mapWrap.geocode(address) ⇒ <code>GeoWrapper</code>
Returns a GeoWrapper class instance encapsulating the Google API response.
https://developers.google.com/maps/documentation/geocoding/intro

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>GeoWrapper</code> - - returns a GeoWrapper instance.

| Param | Type | Description |
| --- | --- | --- |
| address | <code>String</code> | Address to search |

<a name="MapWrap+reverseGeocode"></a>

### mapWrap.reverseGeocode(lat, lng) ⇒ <code>ReverseGeoWrapper</code>
Returns a ReverseGeoWrapper class instance encapsulating the Google API response.
https://developers.google.com/maps/documentation/geocoding/intro

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>ReverseGeoWrapper</code> - - returns a ReverseGeoWrapper instance.

| Param | Type | Description |
| --- | --- | --- |
| lat | <code>Number</code> | latitude |
| lng | <code>Number</code> | longitude |

<a name="MapWrap+directions"></a>

### mapWrap.directions(params) ⇒ <code>DirectionsWrapper</code>
Returns a DirectionsWrapper class instance encapsulating the Google API response.

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>DirectionsWrapper</code> - - returns a DirectionWrapper instance.

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | object literal of options. |
| params.origin | <code>String</code> | Address of origin |
| params.destination | <code>String</code> | Address of destination |
| [params.mode] | <code>String</code> | Optional. Refer to Google Direction API docs for valid modes of transport. `"driving"` by default. https://developers.google.com/maps/documentation/directions/intro#TravelModes |
| [params.units] | <code>String</code> | Optional. Can be `"imperial"` or `"metric"`. `"imperial"` by default. |
| [params.altRoutes] | <code>Boolean</code> | Optional. If `true`, search for alternatives routes. `false` by default. |
| [params.avoidFerries] | <code>Boolean</code> | Optional. If `true`, avoid ferries. `false` by default. |
| [params.avoidHighways] | <code>Boolean</code> | Optional. If `true`, avoid highways. `false` by default. |
| [params.avoidIndoor] | <code>Boolean</code> | Optional. If `true`, avoid indoor. `false` by default. |
| [params.avoidTolls] | <code>Boolean</code> | Optional. If `true`, avoid tolls. `false` by default. |

<a name="MapWrap+nearbySearchPlaces"></a>

### mapWrap.nearbySearchPlaces(params) ⇒ <code>PlaceSearchWrapper</code>
Returns a PlaceSearchWrapper class instance encapsulating the Google API response.

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>PlaceSearchWrapper</code> - - returns a PlaceSearchWrapper instance.

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | object literal of options. |
| params.location | <code>Object</code> | Specify coordinate to serve as a center to look from in the format of `{ lat: Number, lng: Number }` |
| params.radius | <code>Number</code> | Radius to search for nearby places in miles or kilometers, depending on `units` |
| [params.units] | <code>String</code> | Optional. Can be `"imperial"` or `"metric"`. `"imperial"` by default. |
| [params.keyword] | <code>String</code> | Optional. Specify a phrase and look for |
| [params.type] | <code>String</code> | Optional. Filter only for locations matching the specified type string. String type from this list: https://developers.google.com/places/web-service/supported_types |
| [params.minprice] | <code>Number</code> | Optional. Number from -1 to 4 specifying the min price range of the location. `-1` or `undefined` to disable. Must be less than `maxprice`. |
| [params.maxprice] | <code>Number</code> | Optional. Number from -1 to 4 specifying the max price range of the location. `-1` or `undefined` to disable. Info on price ranges: https://developers.google.com/places/web-service/search |

<a name="MapWrap+additionalPlaces"></a>

### mapWrap.additionalPlaces(nextPageToken) ⇒ <code>PlaceSearchWrapper</code>
Returns a PlaceSearchWrapper class instance encapsulating the Google API response given a page token. Does not cache results.

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>PlaceSearchWrapper</code> - - returns a PlaceSearchWrapper instance.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| nextPageToken | <code>String</code> | `null` | Page token acquired from Google API response. https://developers.google.com/places/web-service/search#PlaceSearchPaging |

<a name="MapWrap+placeDetails"></a>

### mapWrap.placeDetails(placeId) ⇒ <code>Object</code>
Returns an object containing place details.

**Kind**: instance method of [<code>MapWrap</code>](#MapWrap)
**Returns**: <code>Object</code> - - returns an object containing the resulting object with the place details.

| Param | Type | Description |
| --- | --- | --- |
| placeId | <code>String</code> | Place ID acquired from Google API response. https://developers.google.com/places/web-service/details |


## GeoWrapper

This wrapper is designed for geocoding. For reverse geocoding, see ReverseGeoWrapper.

* [GeoWrapper](#GeoWrapper)
    * [new GeoWrapper(googleResponse)](#new_GeoWrapper_new)
    * [.getTopAddress(formatted)](#GeoWrapper+getTopAddress) ⇒ <code>string</code> \| <code>object</code> \| `null`
    * [.getAllAddresses()](#GeoWrapper+getAllAddresses) ⇒ <code>array</code>

<a name="new_GeoWrapper_new"></a>

### new GeoWrapper(googleResponse)

| Param | Type | Description |
| --- | --- | --- |
| googleResponse | <code>object</code> \| `null` | The JSON structure returned by Google Geocoding API |

<a name="GeoWrapper+getTopAddress"></a>

### geoWrapper.getTopAddress(formatted) ⇒ <code>string</code> \| <code>object</code> \| `null`
Returns the very first result on the `results` array from Google Geocoding API.

**Kind**: instance method of [<code>GeoWrapper</code>](#GeoWrapper)
**Returns**: <code>string</code> \| <code>object</code> \| `null` - - returns string representing formatted address, { lat, lng } if formatted is false, or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| formatted | <code>boolean</code> | <code>false</code> | Return address as a formatted string if `true`. `false` by default. |

<a name="GeoWrapper+getAllAddresses"></a>

### geoWrapper.getAllAddresses() ⇒ <code>array</code>
Returns the very first result on the `results` array from Google Geocoding API.

**Kind**: instance method of [<code>GeoWrapper</code>](#GeoWrapper)
**Returns**: <code>array</code> - - returns a shallow copy of an array of address objects



## ReverseGeoWrapper
This wrapper is designed for reverse geocoding. For geocoding, see GeoWrapper.

* [ReverseGeoWrapper](#ReverseGeoWrapper)
    * [new ReverseGeoWrapper(googleResponse)](#new_ReverseGeoWrapper_new)
    * [.getTopAddress(formatted)](#ReverseGeoWrapper+getTopAddress) ⇒ <code>string</code> \| <code>object</code> \| `null`
    * [.getAllAddresses()](#ReverseGeoWrapper+getAllAddresses) ⇒ <code>array</code>

<a name="new_ReverseGeoWrapper_new"></a>

### new ReverseGeoWrapper(googleResponse)

| Param | Type | Description |
| --- | --- | --- |
| googleResponse | <code>object</code> \| `null` | The JSON structure returned by Google Geocoding API |

<a name="ReverseGeoWrapper+getTopAddress"></a>

### reverseGeoWrapper.getTopAddress(formatted) ⇒ <code>string</code> \| <code>object</code> \| `null`
Returns the very first result on the `results` array from Google Geocoding API.

**Kind**: instance method of [<code>ReverseGeoWrapper</code>](#ReverseGeoWrapper)
**Returns**: <code>string</code> \| <code>object</code> \| `null` - - returns string representing formatted address, { lat, lng } if formatted is false, or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| formatted | <code>boolean</code> | <code>false</code> | Return address as a formatted string if `true`. `false` by default. |

<a name="ReverseGeoWrapper+getAllAddresses"></a>

### reverseGeoWrapper.getAllAddresses() ⇒ <code>array</code>
Returns the very first result on the `results` array from Google Geocoding API.

**Kind**: instance method of [<code>ReverseGeoWrapper</code>](#ReverseGeoWrapper)
**Returns**: <code>array</code> - - returns a shallow copy of an array of address objects


## DirectionsWrapper

Wrapper for Google Directions API providing functionality to retrive commonly used info
https://developers.google.com/maps/documentation/directions/start

* [DirectionsWrapper](#DirectionsWrapper)
    * [new DirectionsWrapper(googleResponse)](#new_DirectionsWrapper_new)
    * [.getStatus()](#DirectionsWrapper+getStatus) ⇒ <code>string</code> \| `null`
    * [.getErrorMessage()](#DirectionsWrapper+getErrorMessage) ⇒ <code>string</code> \| `null`
    * [.getStartAddress(routeNum)](#DirectionsWrapper+getStartAddress) ⇒ <code>string</code> \| `null`
    * [.getEndAddress(routeNum)](#DirectionsWrapper+getEndAddress) ⇒ <code>string</code> \| `null`
    * [.getRoute(routeNum)](#DirectionsWrapper+getRoute) ⇒ <code>object</code> \| `null`
    * [.getRouteSteps(routeNum)](#DirectionsWrapper+getRouteSteps) ⇒ <code>array</code> \| `null`
    * [.getRoutes()](#DirectionsWrapper+getRoutes) ⇒ <code>object</code> \| `null`

<a name="new_DirectionsWrapper_new"></a>

### new DirectionsWrapper(googleResponse)

| Param | Type | Description |
| --- | --- | --- |
| googleResponse | <code>object</code> \| `null` | The JSON structure returned by Google Directions API |

<a name="DirectionsWrapper+getStatus"></a>

### directionsWrapper.getStatus() ⇒ <code>string</code> \| `null`
Returns status code of API call. If `null`, there was an error.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing a status code or `null` if there was an error.
<a name="DirectionsWrapper+getErrorMessage"></a>

### directionsWrapper.getErrorMessage() ⇒ <code>string</code> \| `null`
Returns the error message of API call, if there is one. If `null`, there was no error message.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing an error message or `null` if there was no error message.
<a name="DirectionsWrapper+getStartAddress"></a>

### directionsWrapper.getStartAddress(routeNum) ⇒ <code>string</code> \| `null`
Returns route's formatted start address specified by `routeNum` in the `routes` array found by Google Directions API.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing formatted end address or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| routeNum | <code>number</code> | <code>0</code> | routeNum to return. 0 <= routeNum < routes.length |

<a name="DirectionsWrapper+getEndAddress"></a>

### directionsWrapper.getEndAddress(routeNum) ⇒ <code>string</code> \| `null`
Returns route's formatted end address specified by `routeNum` in the `routes` array found by Google Directions API.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing formatted end address or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| routeNum | <code>number</code> | <code>0</code> | routeNum to return. 0 <= routeNum < routes.length |

<a name="DirectionsWrapper+getRoute"></a>

### directionsWrapper.getRoute(routeNum) ⇒ <code>object</code> \| `null`
Returns route object `routeNum` in the `routes` array found by Google Directions API.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>object</code> \| `null` - - returns route object or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| routeNum | <code>number</code> | <code>0</code> | routeNum to return. 0 <= routeNum < routes.length |

<a name="DirectionsWrapper+getRouteSteps"></a>

### directionsWrapper.getRouteSteps(routeNum) ⇒ <code>array</code> \| `null`
Returns route `steps` array specified by `routeNum` in the `routes` array found by Google Directions API.

**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>array</code> \| `null` - - returns route `steps` array or null on error.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| routeNum | <code>number</code> | <code>0</code> | routeNum to return. 0 <= routeNum < routes.length |

<a name="DirectionsWrapper+getRoutes"></a>

### directionsWrapper.getRoutes() ⇒ <code>object</code> \| `null`
**Kind**: instance method of [<code>DirectionsWrapper</code>](#DirectionsWrapper)
**Returns**: <code>object</code> \| `null` - - returns all routes found by Google Directions API as an array of objects or null on error.


## PlaceSearchWrapper

Wrapper for Google Places Nearby Search/Text Search API providing functionality to retrive commonly used info
https://developers.google.com/places/web-service/search#nearby-search-and-text-search-responses


* [PlaceSearchWrapper](#PlaceSearchWrapper)
    * [new PlaceSearchWrapper(googleResponse)](#new_PlaceSearchWrapper_new)
    * [.getStatus()](#PlaceSearchWrapper+getStatus) ⇒ <code>string</code> \| `null`
    * [.getErrorMessage()](#PlaceSearchWrapper+getErrorMessage) ⇒ <code>string</code> \| `null`
    * [.getNextPageToken()](#PlaceSearchWrapper+getNextPageToken) ⇒ <code>string</code> \| `null`
    * [.getResults()](#PlaceSearchWrapper+getResults) ⇒ <code>Array</code> \| `null`

<a name="new_PlaceSearchWrapper_new"></a>

### new PlaceSearchWrapper(googleResponse)

| Param | Type | Description |
| --- | --- | --- |
| googleResponse | <code>object</code> \| `null` | The JSON structure returned by Google Places Nearby Search/Text Search API |

<a name="PlaceSearchWrapper+getStatus"></a>

### placeSearchWrapper.getStatus() ⇒ <code>string</code> \| `null`
Returns status code of API call. If `null`, there was an error.

**Kind**: instance method of [<code>PlaceSearchWrapper</code>](#PlaceSearchWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing a status code or `null` if there was an error.
<a name="PlaceSearchWrapper+getErrorMessage"></a>

### placeSearchWrapper.getErrorMessage() ⇒ <code>string</code> \| `null`
Returns the error message of API call, if there is one. If `null`, there was no error message.

**Kind**: instance method of [<code>PlaceSearchWrapper</code>](#PlaceSearchWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing an error message or `null` if there was no error message.
<a name="PlaceSearchWrapper+getNextPageToken"></a>

### placeSearchWrapper.getNextPageToken() ⇒ <code>string</code> \| `null`
https://developers.google.com/places/web-service/search#PlaceSearchPaging

**Kind**: instance method of [<code>PlaceSearchWrapper</code>](#PlaceSearchWrapper)
**Returns**: <code>string</code> \| `null` - - returns string representing the `next_page_token` or null if there is none.
<a name="PlaceSearchWrapper+getResults"></a>

### placeSearchWrapper.getResults() ⇒ <code>Array</code> \| `null`
https://developers.google.com/places/web-service/search#PlaceSearchResults

**Kind**: instance method of [<code>PlaceSearchWrapper</code>](#PlaceSearchWrapper)
**Returns**: <code>Array</code> \| `null` - - Returns an array of up to 20 place objects or null if error.

