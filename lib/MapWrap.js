const axios = require("axios");
const LRUCache = require("./cache/LRUCache");
const ReverseGeoWrapper = require("./wrappers/ReverseGeoWrapper");
const GeoWrapper = require("./wrappers/GeoWrapper");
const DirectionsWrapper = require("./wrappers/DirectionsWrapper");
const PlaceSearchWrapper = require("./wrappers/PlaceSearchWrapper");
const Joi = require("joi");
const nearbySearchModel = require("./models/nearbySearchPlaces");

/**
 * Wrapper for several Google API services including Directions, Geocoding, and Places and built in caching
 * @constructor
 * @param {String} key - Google API Key to be used. If a key was restricted to a certain service, you must create multiple MapWrap instances.
 */
class MapWrap {
  constructor(key) {
    if (!key) {
      throw new Error("Google Maps API Key required");
    }
    this.API_KEY = key;
    this.googleMaps = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api"
    });
    this.reverseGeoCache = new LRUCache();
    this.geoCache = new LRUCache();
    this.directionsCache = new LRUCache();
    this.placesCache = new LRUCache();
  }

  /**
   * Returns a GeoWrapper object encapsulating the Google API response.
   * @param {String} address - Address to search
   * @returns {GeoWrapper} - returns a GeoWrapper instance.
   */
  async geocode(address) {
    if (typeof address !== "string")
      throw new TypeError("address must be a String");
    
    const data = this.geoCache.get(address);
    if (!data) {
      try {
        const response = await this.googleMaps.get(`/geocode/json?address=${address.replace(/#/g, '')}&key=${this.API_KEY}`);
        const initData = new GeoWrapper(response.data);
        this.geoCache.set(address, initData);

        return initData;
      } catch (e) {
        return new GeoWrapper(); 
      }
    } else {
      console.log("Cache hit");
      return data;
    }


  }

  /**
   * Returns a ReverseGeoWrapper object encapsulating the Google API response.
   * @param {Number} lat - latitude
   * @param {Number} lng - longitude
   * @returns {ReverseGeoWrapper} - returns a ReverseGeoWrapper instance.
   */
  async reverseGeocode(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number")
      throw new TypeError("lat and lng must be a Number");

    let data = this.reverseGeoCache.get(`${lat},${lng}`);
    if (!data) {
      try {
      
        const response = await this.googleMaps.get(`/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`);
        const initData = new ReverseGeoWrapper(response.data);
        this.reverseGeoCache.set(`${lat},${lng}`, initData);

        return initData;
      } catch (e) {
        return new ReverseGeoWrapper();
      }
    } else {
      console.log("Cache hit");
      return data;
    }
  }

  /**
   * Returns a DirectionsWrapper object encapsulating the Google API response.
   * @param {object} - object literal containing required keys `origin` (string) and `destination` (string). 
   * Optional keys: 
   * `mode` (string) refer to Google Direction API docs for valid modes of transport.
   * `units` ("imperial"|metric"),
   * `altRoutes` (boolean),
   * `avoidFerries` (boolean),
   * `avoidHighways` (boolean),
   * `avoidIndoor` (boolean),
   * `avoidTolls` (boolean)
   * @returns {(DirectionsWrapper)} - returns a DirectionWrapper instance.
   */
  async directions({ origin, destination, altRoutes, avoidFerries, avoidHighways, avoidIndoor, avoidTolls, mode, units }) {
    if (!origin || !destination) {
      throw new Error("Origin and Destination required");
    }
    if (typeof origin !== "string" || typeof destination !== "string")
      throw new TypeError("Origin and Destination must be string");


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
        key: this.API_KEY
      }
    }
    
    const buildCacheKey = `${origin}&${destination}&${mode || "driving"}&${altRoutes || false}&${units || "imperial"}&${avoidStr || "null"}`;
    let data = this.directionsCache.get(buildCacheKey);
    if (!data) {
      try {
        const response = await this.googleMaps.get("/directions/json", mapsParams);
        // wrap data
        // cache it with buildCacheKey
        const initData = new DirectionsWrapper(response.data);
        this.directionsCache.set(buildCacheKey, initData);

        // return wrapped data
        return initData;
      } catch(e) {
        return new DirectionsWrapper(); 
      }
    } else {
      console.log("Cache hit");
      return data;
    }
  }

  /**
   * Returns a PlaceSearchWrapper object encapsulating the Google API response.
   * @param {Object} params - object literal of options.
   * @param {Object} params.location - Specify coordinate to serve as a center to look from in the format of `{ lat: Number, lng: Number }`
   * @param {Number} params.radius - Radius to search for nearby places in miles or kilometers, depending on `units`
   * @param {String} [params.units] -  Optional. Can be "imperial" or "metric". "imperial" by default.
   * @param {String} [params.keyword] - Optional. Specify a phrase and look for
   * @param {String} [params.type] - Optional. Filter only for locations matching the specified type string.
   * String type from this list: https://developers.google.com/places/web-service/supported_types
   * @param {Number} [params.minprice] - Optional. Number from -1 to 4 specifying the min price range of the location. `-1` or `undefined` to disable. Must be less than `maxprice`.
   * @param {Number} [params.maxprice] - Optional. Number from -1 to 4 specifying the max price range of the location. `-1` or `undefined` to disable.
   * Info on price ranges: https://developers.google.com/places/web-service/search
   * @returns {PlaceSearchWrapper} - returns a PlaceSearchWrapper instance.
   */
  async nearbySearchPlaces(params) {
    const { value, error } = Joi.validate(params, nearbySearchModel);
    if (value.minprice > value.maxprice) {
      throw new Error("minprice excees maxprice");
    }
    if (error) {
      // error.details.map(e => console.log(e.message));
      throw new Error(error.details[0].message);
    }

    let { location, radius, units, keyword, type, minprice, maxprice } = value;

    const placesParams = {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: units === "imperial" || units === undefined ? parseFloat(radius) * 1609 : parseFloat(radius) * 1000, // calculates radius in meters
        ...keyword && { keyword },
        ...type && { type },
        ...(minprice !== -1 && minprice !== undefined) && { minprice },
        ...(maxprice !== -1 && maxprice !== undefined) && { maxprice }, // this needs testing.
        key: this.API_KEY
      }
    };

    const buildCacheKey = `${location.lat},${location.lng}&${radius}&${keyword || ""}&${units || "imperial"}&${type || "null"}&${minprice || -1}&${maxprice || -1}`;
    let data = this.placesCache.get(buildCacheKey);
    if (!data) {
      try {
        console.log(placesParams);
        const response = await this.googleMaps.get(`/place/nearbysearch/json`, placesParams);
        console.log(response.data);
        // wrap data
        // cache it with buildCacheKey
        const initData = new PlaceSearchWrapper(response.data);
        this.placesCache.set(buildCacheKey, initData);
        // return new PlaceSearchWrapper(); 
        // return wrapped data
        return initData;
      } catch(e) {
        return new PlaceSearchWrapper(); 
      }
    } else {
      console.log("Cache hit");
      return data;
    }
  }

  async additionalPlaces(nextPageToken=null) {
    if (!nextPageToken || typeof nextPageToken !== "string") {
      throw new TypeError("`nextPageToken must be of type string`");
    }
    const params = {
      pagetoken: nextPageToken,
      key: this.API_KEY
    }
    try {
      const response = await this.googleMaps.get(`/place/nearbysearch/json`, params);

      return new PlaceSearchWrapper(response.data);

    } catch(e) {
      return new PlaceSearchWrapper();
    }
  }

  async placeDetails() {
    // wip
  }

}

module.exports = MapWrap;