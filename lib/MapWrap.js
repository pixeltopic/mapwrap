const axios = require("axios");
const LRUCache = require("./cache/LRUCache");
const ReverseGeoWrapper = require("./wrappers/ReverseGeoWrapper");
const GeoWrapper = require("./wrappers/GeoWrapper");
const DirectionsWrapper = require("./wrappers/DirectionsWrapper");
const PlaceSearchWrapper = require("./wrappers/PlaceSearchWrapper");
const Joi = require("joi");
const nearbySearchModel = require("./models/nearbySearchPlaces");
const directionsModel = require("./models/directions");
const mapwrapConfigModel = require("./models/mapwrapConfig");

/**
 * Wrapper for several Google API services including Directions, Geocoding, and Places with built in LRU caching.
 */
class MapWrap {
  /**
   * constructor to configure MapWrap
   * @constructor
   * @param {Object} config - Object to configure MapWrap instance.
   * @param {String} config.DEFAULT_API_KEY - Google API Key to be used. If a key was restricted to a certain service, you must use `useRestrictedKeys`.
   * 
   * @param {Object} [config.useRestrictedKeys] - Alternative option to DEFAULT_API_KEY.
   * @param {String} [config.useRestrictedKeys.GEOCODING_API_KEY] - API key for Geocoding API services.
   * @param {String} [config.useRestrictedKeys.DIRECTIONS_API_KEY] - API key for Directions API services.
   * @param {String} [config.useRestrictedKeys.PLACES_API_KEY] - API key for Places API services.
   * 
   * @param {Boolean} [config.logCache] - enables logging of messages when an item is retrieved from each LRU cache. `false` by default.
   * @param {Function} [config.logger] - Specify a custom logger function to render any messages the instance will produce. `console.log` bu default.
   * 
   * @param {Object} [config.cacheMaxItemAges] - object containing configuration to set a custom max item age for each cache in ms. Cannot be under 1 minute or over 30 days.
   * @param {Number} [config.cacheMaxItemAges.reverseGeoCache] - specify max item age of reverse geocoding cache in ms. 300000 by default.
   * @param {Number} [config.cacheMaxItemAges.geoCache] - specify max item age of geocoding cache in ms. 300000 by default.
   * @param {Number} [config.cacheMaxItemAges.directionsCache] - specify max item age of directions cache in ms. 300000 by default.
   * @param {Number} [config.cacheMaxItemAges.nearbySearchCache] - specify max item age of nearby search cache in ms. 300000 by default.
   * @param {Number} [config.cacheMaxItemAges.placeDetailsCache] - specify max item age of place details cache in ms. 300000 by default.
   * 
   * @param {Object} [config.cacheMaxSizes] - object containing configuration to set a custom size for each cache.
   * @param {Number} [config.cacheMaxSizes.reverseGeoCache] - specify max size of reverse geocoding cache. 10 by default.
   * @param {Number} [config.cacheMaxSizes.geoCache] - specify max size of geocoding cache. 10 by default.
   * @param {Number} [config.cacheMaxSizes.directionsCache] - specify max size of directions cache. 10 by default.
   * @param {Number} [config.cacheMaxSizes.nearbySearchCache] - specify max size of nearby search cache. 10 by default.
   * @param {Number} [config.cacheMaxSizes.placeDetailsCache] - specify max size of place details cache. 10 by default.
   */
  constructor(config) {
    const { value, error } = Joi.validate(config, mapwrapConfigModel);
    
    if (error) {
      // console.log(error);
      throw new Error(error.message);
    }

    const { 
      DEFAULT_API_KEY, 
      logCache, 
      logger,
      useRestrictedKeys, 
      cacheMaxItemAges,
      cacheMaxSizes
    } = value;

    this._keys = {
      GEOCODING_API_KEY: useRestrictedKeys.GEOCODING_API_KEY || DEFAULT_API_KEY,
      DIRECTIONS_API_KEY: useRestrictedKeys.DIRECTIONS_API_KEY || DEFAULT_API_KEY,
      PLACES_API_KEY: useRestrictedKeys.PLACES_API_KEY || DEFAULT_API_KEY
    };

    this._googleMaps = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api"
    });

    this._reverseGeoCache = new LRUCache(cacheMaxSizes.reverseGeoCache, cacheMaxItemAges.reverseGeoCache);
    this._geoCache = new LRUCache(cacheMaxSizes.geoCache, cacheMaxItemAges.geoCache);
    this._directionsCache = new LRUCache(cacheMaxSizes.directionsCache, cacheMaxItemAges.directionsCache);
    this._nearbySearchCache = new LRUCache(cacheMaxSizes.nearbySearchCache, cacheMaxItemAges.nearbySearchCache);
    this._placeDetailsCache = new LRUCache(cacheMaxSizes.placeDetailsCache, cacheMaxItemAges.placeDetailsCache);
    this._logCache = logCache;
    this._logger = logger;
  }

  /**
   * Returns a GeoWrapper object encapsulating the Google API response.
   * https://developers.google.com/maps/documentation/geocoding/intro
   * @param {String} address - Address to search
   * @returns {Promise<GeoWrapper>} - returns a GeoWrapper instance.
   */
  async geocode(address) {
    if (typeof address !== "string")
      throw new TypeError("`address` must be a string");
    
    const data = this._geoCache.get(address);
    if (!data) {
      try {
        const response = await this._googleMaps.get(`/geocode/json?address=${address.replace(/#/g, '')}&key=${this._keys.GEOCODING_API_KEY}`);
        const initData = new GeoWrapper(response.data);
        this._geoCache.set(address, initData);

        return initData;
      } catch (e) {
        throw new Error(e.message);
      }
    } else {
      if (this._logCache) {
        this._logger("MapWrap.geocode: Cache hit.");
      }
      return data;
    }


  }

  /**
   * Returns a ReverseGeoWrapper object encapsulating the Google API response.
   * https://developers.google.com/maps/documentation/geocoding/intro
   * @param {Number} lat - latitude
   * @param {Number} lng - longitude
   * @returns {Promise<ReverseGeoWrapper>} - returns a ReverseGeoWrapper instance.
   */
  async reverseGeocode(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number")
      throw new TypeError("lat and lng must be a Number");

    let data = this._reverseGeoCache.get(`${lat},${lng}`);
    if (!data) {
      try {
      
        const response = await this._googleMaps.get(`/geocode/json?latlng=${lat},${lng}&key=${this._keys.GEOCODING_API_KEY}`);
        const initData = new ReverseGeoWrapper(response.data);
        this._reverseGeoCache.set(`${lat},${lng}`, initData);

        return initData;
      } catch (e) {
        throw new Error(e.message);
      }
    } else {
      if (this._logCache) {
        this._logger("MapWrap.reverseGeocode: Cache hit.");
      }
      return data;
    }
  }

  /**
   * Returns a DirectionsWrapper object encapsulating the Google API response.
   * @param {Object} params - object literal of options.
   * @param {String} params.origin - Address of origin
   * @param {String} params.destination - Address of destination
   * @param {String} [params.mode] - Optional. Refer to Google Direction API docs for valid modes of transport. `"driving"` by default.
   * https://developers.google.com/maps/documentation/directions/intro#TravelModes
   * @param {String} [params.units] -  Optional. Can be `"imperial"` or `"metric"`. `"imperial"` by default.
   * @param {Boolean} [params.altRoutes] - Optional. If `true`, search for alternatives routes. `false` by default.
   * @param {Boolean} [params.avoidFerries] - Optional. If `true`, avoid ferries. `false` by default.
   * @param {Boolean} [params.avoidHighways] - Optional. If `true`, avoid highways. `false` by default.
   * @param {Boolean} [params.avoidIndoor] - Optional. If `true`, avoid indoor. `false` by default.
   * @param {Boolean} [params.avoidTolls] - Optional. If `true`, avoid tolls. `false` by default.
   * @returns {Promise<DirectionsWrapper>} - returns a DirectionWrapper instance.
   */
  async directions(params) {
    const { value, error } = Joi.validate(params, directionsModel);
    
    if (error) {
      // error.details.map(e => console.log(e.message));
      throw new Error(error.message);
    }

    if (value.avoidIndoor && value.mode !== "walking")
      throw new Error("`avoidIndoor` only allowed if mode is `walking`");

    let { origin, destination, altRoutes, avoidFerries, avoidHighways, avoidIndoor, avoidTolls, mode, units } = value;

    let avoidArr = [];
    if (avoidTolls) avoidArr.push("tolls"); 
    if (avoidHighways) avoidArr.push("highways");
    if (avoidFerries) avoidArr.push("ferries");
    if (avoidIndoor) avoidArr.push("indoor");
    const avoidStr = avoidArr.join("|");

    const mapsParams = {
      params: {
        origin: origin.replace(/#/g, ''), // regex eliminates invalid characters when making http request
        destination: destination.replace(/#/g, ''),
        mode: mode || "driving",
        alternatives: altRoutes || false,
        units: units || "imperial",
        ...avoidStr && { avoid: avoidStr },
        key: this._keys.DIRECTIONS_API_KEY
      }
    }
    
    const buildCacheKey = `${origin}&${destination}&${mode || "driving"}&${altRoutes || false}&${units || "imperial"}&${avoidStr || "null"}`;
    let data = this._directionsCache.get(buildCacheKey);
    if (!data) {
      try {
        const response = await this._googleMaps.get("/directions/json", mapsParams);
        // wrap data
        // cache it with buildCacheKey
        const initData = new DirectionsWrapper(response.data);
        this._directionsCache.set(buildCacheKey, initData);

        // return wrapped data
        return initData;
      } catch(e) {
        throw new Error(e.message);
      }
    } else {
      if (this._logCache) {
        this._logger("MapWrap.directions: Cache hit.");
      }
      return data;
    }
  }

  /**
   * Returns a PlaceSearchWrapper object encapsulating the Google API response.
   * @param {Object} params - object literal of options.
   * @param {Object} params.location - Specify coordinate to serve as a center to look from in the format of `{ lat: Number, lng: Number }`
   * @param {Number} params.radius - Radius in meters. Must be no less than 1 and no more than 50000.
   * @param {String} [params.keyword] - Optional. Specify a phrase and look for
   * @param {String} [params.type] - Optional. Filter only for locations matching the specified type string.
   * String type from this list: https://developers.google.com/places/web-service/supported_types
   * @param {Number} [params.minprice] - Optional. Number from -1 to 4 specifying the min price range of the location. `-1` or `undefined` to disable. Must be less than `maxprice`.
   * @param {Number} [params.maxprice] - Optional. Number from -1 to 4 specifying the max price range of the location. `-1` or `undefined` to disable.
   * Info on price ranges: https://developers.google.com/places/web-service/search
   * @returns {Promise<PlaceSearchWrapper>} - returns a PlaceSearchWrapper instance.
   */
  async nearbySearchPlaces(params) {
    const { value, error } = Joi.validate(params, nearbySearchModel);
    if (value.minprice > value.maxprice) {
      throw new Error("minprice excees maxprice");
    }
    if (error) {
      // error.details.map(e => console.log(e.message));
      throw new Error(error.message);
    }

    let { location, radius, keyword, type, minprice, maxprice } = value;

    const placesParams = {
      params: {
        location: `${location.lat},${location.lng}`,
        radius,
        ...keyword && { keyword },
        ...type && { type },
        ...(minprice !== -1 && minprice !== undefined) && { minprice },
        ...(maxprice !== -1 && maxprice !== undefined) && { maxprice },
        key: this._keys.PLACES_API_KEY
      }
    };

    const buildCacheKey = `${location.lat},${location.lng}&${radius}&${keyword || ""}&${type || "null"}&${minprice || -1}&${maxprice || -1}`;
    let data = this._nearbySearchCache.get(buildCacheKey);
    if (!data) {
      try {
        const response = await this._googleMaps.get(`/place/nearbysearch/json`, placesParams);
        // wrap data
        // cache it with buildCacheKey
        const initData = new PlaceSearchWrapper(response.data);
        this._nearbySearchCache.set(buildCacheKey, initData);
        // return wrapped data
        return initData;
      } catch(e) {
        throw new Error(e.message);
      }
    } else {
      if (this._logCache) {
        this._logger("MapWrap.nearbySearchPlaces: Cache hit.");
      }
      return data;
    }
  }

  /**
   * Returns a PlaceSearchWrapper object encapsulating the Google API response given a page token. Does not cache results.
   * @param {String} nextPageToken - Page token acquired from Google API response. https://developers.google.com/places/web-service/search#PlaceSearchPaging
   * @returns {Promise<PlaceSearchWrapper>} - returns a PlaceSearchWrapper instance.
   */
  async additionalPlaces(nextPageToken=null) {
    if (!nextPageToken || typeof nextPageToken !== "string") {
      throw new TypeError("`nextPageToken` must be of type `string`");
    }
    const placesParams = {
      params: {
        pagetoken: nextPageToken,
        key: this._keys.PLACES_API_KEY
      }
    };
    
    try {
      const response = await this._googleMaps.get(`/place/nearbysearch/json`, placesParams);
      return new PlaceSearchWrapper(response.data);

    } catch(e) {
      throw new Error(e.message);
    }
  }

  /**
   * Returns an object containing place details.
   * @param {String} placeId - Place ID acquired from Google API response. https://developers.google.com/places/web-service/details
   * @returns {Promise<Object>} - returns an object containing the resulting object with the place details.
   */
  async placeDetails(placeId) {
    if (!placeId || typeof placeId !== "string") {
      throw new TypeError("`placeId` must be of type `string`");
    }

    let data = this._placeDetailsCache.get(placeId);
    if (!data) {
      try {
        const response = await this._googleMaps.get(`/place/details/json?placeid=${placeId}&key=${this._keys.PLACES_API_KEY}`);
      
        this._placeDetailsCache.set(placeId, response.data);
        return response.data;
      } catch(e) {
        throw new Error(e.message);
      }
    } else {
      if (this._logCache) {
        this._logger("MapWrap.placeDetails: Cache hit.");
      }
      return data;
    }   
  }

}

module.exports = MapWrap;