/**
 * Wrapper for Google Directions API providing functionality to retrive commonly used info
 * @constructor
 * @param {(object|null)} googleResponse - The JSON structure returned by Google Directions API
 */
class DirectionsWrapper {
  constructor(googleResponse) {
    if (googleResponse) {
      this.googleResponse = googleResponse;
    } else {
      this.googleResponse = {};
    }
  }

  /**
   * Returns route's formatted start address specified by `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(string|null)} - returns string representing formatted end address or null on error.
   */
  getStartAddress(routeNum = 0) {
    if (!this.googleResponse.routes) {
      return null;
    }
    if (this.googleResponse.routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this.googleResponse.routes[routeNum].legs[0].start_address;
  }

  /**
   * Returns route's formatted end address specified by `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(string|null)} - returns string representing formatted end address or null on error.
   */
  getEndAddress(routeNum = 0) {
    if (!this.googleResponse.routes) {
      return null;
    }
    if (this.googleResponse.routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this.googleResponse.routes[routeNum].legs[0].end_address;
  }

  /**
   * Returns route object `routeNum` in the `routes` array found by Google Directions API.
   * @param {number} routeNum - routeNum to return. 0 <= routeNum < routes.length
   * @returns {(object|null)} - returns route object or null on error.
   */
  getRoute(routeNum = 0) {
    if (!this.googleResponse.routes) {
      return null;
    }
    if (this.googleResponse.routes.length <= routeNum || routeNum < 0) {
      return null;
    }
    return this.googleResponse.routes[routeNum];
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
    if (
      this.googleResponse &&
      this.googleResponse.routes &&
      this.googleResponse.routes.length > 0
    ) {
      return this.googleResponse.routes;
    }
    return null;
  }
}

module.exports = DirectionsWrapper;
