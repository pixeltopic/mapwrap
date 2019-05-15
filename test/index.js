const MapWrap = require("../lib");
const { GOOGLE_API_KEY } = require("./testUtils").requireConfig();
const chai = require("chai");
const asserttype = require("chai-asserttype");
const chaiAsPromised = require("chai-as-promised");

chai.use(asserttype);
chai.use(chaiAsPromised)

const expect = chai.expect;

if (!GOOGLE_API_KEY) {
  return;
}

describe("MapWrap", () => {
  it("should throw an error", () => {
    expect(() => MapWrap()).to.throw();
    expect(() => MapWrap({})).to.throw();
    expect(() => MapWrap({ DEFAULT_API_KEY: "" })).to.throw();
    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: true, 
      useRestrictedKeys: {
        DIRECTIONS_API_KEY: null,
      }
    })).to.throw();

    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: true, 
      useRestrictedKeys: {
        DIRECTIONS_API_KEY: null,
      },
      cacheMaxSizes: {
        nearbySearchCache: 15, 
        placeDetailsCache: -1
      }
    
    })).to.throw();
  });
  it("should not throw an error", () => {
    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: true, 
      useRestrictedKeys: {
        GEOCODING_API_KEY: "geocoding_api_key",
      }
    })).to.not.throw();

    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: false,
      useRestrictedKeys: {
      
      },
    })).to.not.throw();

    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: true, 
      useRestrictedKeys: {
        GEOCODING_API_KEY: "geocoding_api_key",
      },
      cacheMaxItemAges: {

      },
      cacheMaxSizes: {

      }
    })).to.not.throw();

    expect(() => MapWrap({
      DEFAULT_API_KEY: GOOGLE_API_KEY,
      logCache: true, 
      useRestrictedKeys: {
        GEOCODING_API_KEY: "geocoding_api_key",
      },
      cacheMaxItemAges: {
        geoCache: 120000,
        placeDetailsCache: 1000 * 60 * 60 * 24
      },
      cacheMaxSizes: {
        directionsCache: 10,
        placeDetailsCache: 30
      }
    })).to.not.throw();
  });
});