/**
 * Wrapper for Google Directions API providing functionality to retrive commonly used info
 * https://developers.google.com/maps/documentation/directions/start
 * @constructor
 * @param {(object|null)} googleResponse - The JSON structure returned by Google Directions API
 */
class DirectionsWrapper {
  constructor(googleResponse) {
    if (googleResponse) {
      const { routes, status, error_message } = googleResponse;
      if (routes && Array.isArray(routes) && status) {
        this._routes = routes;
        this._status = status;
        this._error_message = error_message || null;
      } else {
        this._routes = [];
        this._status = null;
        this._error_message = null;
      }
    } else {
      this._routes = [];
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
   * Returns route's formatted start address specified by `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(string|null)} - returns string representing formatted end address or null on error.
   */
  getStartAddress(routeNum = 0) {
    if (!Array.isArray(this._routes)) {
      return null;
    }
    if (this._routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this._routes[routeNum].legs[0].start_address;
  }

  /**
   * Returns route's formatted end address specified by `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(string|null)} - returns string representing formatted end address or null on error.
   */
  getEndAddress(routeNum = 0) {
    if (!Array.isArray(this._routes)) {
      return null;
    }
    if (this._routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this._routes[routeNum].legs[0].end_address;
  }

  /**
   * Returns route object `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(object|null)} - returns route object or null on error.
   */
  getRoute(routeNum = 0) {
    if (!Array.isArray(this._routes)) {
      return null;
    }
    if (this._routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this._routes[routeNum];
  }

  /**
   * Returns route `steps` array specified by `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(array|null)} - returns route `steps` array or null on error.
   */
  getRouteSteps(routeNum = 0) {
    const route = this.getRoute(routeNum);
    if (route && Array.isArray(route.legs)) {
      return route.legs[0].steps || null;
    }
    return null;
  }

  /**
   * @returns {(object|null)} - returns all routes found by Google Directions API as an array of objects or null on error.
   */
  getRoutes() {
    if (Array.isArray(this._routes) && this._routes.length > 0) {
      return this._routes;
    } else if (Array.isArray(this._routes)) {
      return [];
    }
    return null;
  }
}

module.exports = DirectionsWrapper;
