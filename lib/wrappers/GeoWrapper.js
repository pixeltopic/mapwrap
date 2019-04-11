/**
 * Wrapper for Google Geocoding API providing functionality to retrive commonly used info
 * This wrapper is designed for geocoding. For reverse geocoding, see ReverseGeoWrapper.
 * @constructor
 * @param {(object|null)} googleResponse - The JSON structure returned by Google Geocoding API
 */
class GeoWrapper {
  constructor(googleResponse) {
    if (googleResponse && googleResponse.results)
      this.googleResponse = [...googleResponse.results];
    else this.googleResponse = [];
  }

  /**
   * Returns the very first result on the `results` array from Google Geocoding API.
   * @param {boolean} formatted - Return address as a formatted string if `true`. `false` by default.
   * @returns {(string|object|null)} - returns string representing formatted address, { lat, lng } if formatted is false, or null on error.
   */
  getTopAddress(formatted = false) {
    // returns the latitude and longitude pair of the first result on the list
    const results = this.googleResponse;
    if (Array.isArray(results) && results.length > 0 && !formatted) {
      if (results[0].geometry && results[0].geometry.location) {
        return results[0].geometry.location;
      }
      return null;
    } else if (Array.isArray(results) && results.length > 0 && formatted) {
      return results[0].formatted_address || null;
    } else {
      return null;
    }
  }

  /**
   * Returns the very first result on the `results` array from Google Geocoding API.
   * @returns {array} - returns a shallow copy of an array of address objects
   */
  getAllAddresses() {
    if (Array.isArray(this.googleResponse)) {
      return [...this.googleResponse];
    }
    return null;
  }
}

module.exports = GeoWrapper;
