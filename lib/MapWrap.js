const axios = require("axios");
const LRUCache = require("./cache/LRUCache");
const ReverseGeoWrapper = require("./wrappers/ReverseGeoWrapper");

class MapWrap {
  constructor(key) {
    this.API_KEY = key;
    this.googleMaps = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api"
    });
    this.reverseGeoCache = new LRUCache();
    this.directionsCache = new LRUCache();
  }

  getDirections(param) {
    console.log(param);
  }

  async reverseGeocode(lat, lng) {
    // check type of args validation, throw error if not number
    let data = this.reverseGeoCache.get(`${lat},${lng}`);
    if (!data) {
      try {
      
        const response = await this.googleMaps.get(`/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`);
        const initData = new ReverseGeoWrapper(response.data);
        this.reverseGeoCache.set(`${lat},${lng}`, initData);

        return initData;
      } catch (e) {
        console.log(e);
        return null; 
      }
    } else {
      console.log("Cache hit");
      return data;
    }
  }

}

module.exports = MapWrap;