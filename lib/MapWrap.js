const axios = require("axios");
const LRUCache = require("./cache/LRUCache");
const ReverseGeoWrapper = require("./wrappers/ReverseGeoWrapper");
const GeoWrapper = require("./wrappers/GeoWrapper");
const DirectionsWrapper = require("./wrappers/DirectionsWrapper");
const PlaceSearchWrapper = require("./wrappers/PlaceSearchWrapper");

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

  async nearbySearchPlaces({ location, radius, units, keyword, type, minprice, maxprice }) {
    if (!location) 
      throw new Error("`location` must be an object property");
    if (!radius) 
      throw new Error("`radius` must be an object property");

    if (typeof location !== "string")
      throw new TypeError("`location` must be a string");
    if (typeof radius !== "number")
      throw new TypeError("`radius` must be a number of at least 0."); // later test what happens to the request if radius is too large and validate accordingly
    if (units && typeof units !== "string")
      throw new TypeError("`units` must be a string of \"metric\" or \"imperial\""); 
    if (units && units !== "metric" && units !== "imperial")
      throw new TypeError("`units` must be a string of \"metric\" or \"imperial\""); 
    if (keyword && typeof keyword !== "string")
      throw new TypeError("`keyword` must be a string");
    if (type && typeof type !== "string")
      throw new TypeError("`type` must be a string");
    if (minprice && typeof minprice !== "number")
      throw new TypeError("`minprice` must be a number from -1 to 4.");
    if (maxprice && typeof maxprice !== "number")
      throw new TypeError("`maxprice` must be a number from -1 to 4.");

    if (!units) {
      units = "imperial";
    }

    const placesParams = {
      params: {
        location,
        radius: units === "imperial" ? parseFloat(radius) * 1609 : parseFloat(radius) * 1000, // calculates radius in meters
        ...keyword && { keyword },
        ...type && { type },
        ...(minprice !== -1 && minprice !== undefined) && { minprice },
        ...(maxprice !== -1 && maxprice !== undefined) && { maxprice }, // this needs testing.
        key: this.API_KEY
      }
    };

    const buildCacheKey = `${location}&${radius}&${keyword || ""}&${units || "imperial"}&${type || "null"}&${minprice || -1}&${maxprice || -1}`;
    let data = this.placesCache.get(buildCacheKey);
    if (!data) {
      try {
        const response = await this.googleMaps.get(`/place/nearbysearch/json`, placesParams);
        // wrap data
        // cache it with buildCacheKey
        const initData = new PlaceSearchWrapper(response.data);
        this.placesCache.set(buildCacheKey, initData);

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