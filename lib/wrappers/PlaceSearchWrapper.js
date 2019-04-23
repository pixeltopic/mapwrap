const { OK, ZERO_RESULTS } = require("../utils/enums/placesEnums");

/**
 * Wrapper for Google Places Nearby Search/Text Search API providing functionality to retrive commonly used info
 * https://developers.google.com/places/web-service/search#nearby-search-and-text-search-responses
 * @constructor
 * @param {(object|null)} googleResponse - The JSON structure returned by Google Places Nearby Search/Text Search API
 */
class PlaceSearchWrapper {
  constructor(googleResponse) {
    if (googleResponse) {
      const { next_page_token, results, status, candidates, error_message } = googleResponse;
      if (candidates) {
        throw new Error("Wrapper does not yet support Find Place responses.")
      }
      this._next_page_token = next_page_token || null;
      this._results = results;
      this._status = status;
      this._error_message = error_message || null;
    } else {
      this._next_page_token = null;
      this._results = [];
      this._status = null;
      this._error_message = null;
    }
  }

  /**
   * Returns status code of API call. If `null`, there was an error.
   * @returns {(string|null)} - returns string representing a status code or `null` if there was an error.
   */
  getStatus() {
    return this._status;
  }

  /**
   * Returns the error message of API call, if there is one. If `null`, there was no error message.
   * @returns {(string|null)} - returns string representing an error message or `null` if there was no error message.
   */
  getErrorMessage() {
    return this._error_message;
  }

  /**
   * Returns a `next_page_token` for accessing additional results.
   * https://developers.google.com/places/web-service/search#PlaceSearchPaging
   * @returns {(string|null)} - returns string representing the `next_page_token` or null if there is none.
   */
  getNextPageToken() {
    if (this._status !== OK) {
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
    if (this._status !== OK || this._status === ZERO_RESULTS) {
      return null;
    }
    if (Array.isArray(this._results)) {
      return this._results;
    }
    return null;
  }
}

module.exports = PlaceSearchWrapper;