const { OK, ZERO_RESULTS, UNKNOWN_ERROR } = require("../utils/enums/placesEnums");

/**
 * Wrapper for Google Places Nearby Search/Text Search API providing functionality to retrive commonly used info
 * https://developers.google.com/places/web-service/search#nearby-search-and-text-search-responses
 * @constructor
 * @param {(object|null)} googleResponse - The JSON structure returned by Google Places Nearby Search/Text Search API
 */
class PlaceSearchWrapper {
  constructor(googleResponse) {
    if (googleResponse) {
      const { next_page_token, results, status, candidates } = googleResponse;
      if (candidates) {
        throw new Error("Wrapper does not yet support Find Place responses.")
      }
      this._next_page_token = next_page_token;
      this._results = results;
      this._status = status;
    } else {
      this._next_page_token = null;
      this._results = [];
      this._status = UNKNOWN_ERROR;
    }
  }

  /**
   * Returns a `next_page_token` for accessing additional results.
   * https://developers.google.com/places/web-service/search#PlaceSearchPaging
   * @returns {(string|null)} - returns string representing the `next_page_token` or null if there is none.
   */
  getNextPageToken() {
    if (!OK) {
      return null;
    }

    if (this._next_page_token && typeof this._next_page_token === "string") {
      return this._next_page_token;
    }
    return null;
  }

  /**
   * Returns an array of up to 20 place objects.
   * https://developers.google.com/places/web-service/search#PlaceSearchResults
   * @returns {(Array|null)} - Returns an array of up to 20 place objects or null if error.
   */
  getResults() {
    if (!OK && !ZERO_RESULTS) {
      return null;
    }
    if (Array.isArray(this._results)) {
      return this._results;
    }
    return null;
  }
}

module.exports = PlaceSearchWrapper;