const MapWrap = require("./testUtils").selectEnvTest();
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

describe("MapWrap.nearbySearchPlaces", async () => {
  
  describe.skip("Testing Joi schema validation", async () => {
    let mapWrapInstance;
    let lat = 33.651021, lng = -117.841550;

    before("should instantiate mapwrap", () => {
      mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
    });

    it("should test an empty options object", async () => {
      expect(mapWrapInstance.nearbySearchPlaces({})).to.be.rejectedWith(Error);
    });

    it("should test it with one required key", async () => {
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lat, lng } })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({ radius: 20 })).to.be.rejectedWith(Error);
    });

    it("should test validation of nested schema", async () => {
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lat }, radius: 15 })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lng }, radius: 15 })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({ location: {}, radius: 15 })).to.be.rejectedWith(Error);
    });

    it("should test it with all required keys", async () => {
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lat, lng }, radius: "15" })).to.not.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lat, lng }, radius: 15 })).to.not.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({ location: { lat, lng }, radius: -1 })).be.rejectedWith(Error);
    });

    // obsolete tests 

    // it("should test the units key", async () => {
    //   expect(mapWrapInstance.nearbySearchPlaces({ 
    //     location: { lat, lng }, 
    //     radius: "15",
    //     units: "metric"
    //   })).to.not.be.rejectedWith(Error);
    //   expect(mapWrapInstance.nearbySearchPlaces({ 
    //     location: { lat, lng }, 
    //     radius: "15",
    //     units: "imperial"
    //   })).to.not.be.rejectedWith(Error);
    //   expect(mapWrapInstance.nearbySearchPlaces({ 
    //     location: { lat, lng }, 
    //     radius: "15",
    //     units: "foobar"
    //   })).to.be.rejectedWith(Error);
    //   expect(mapWrapInstance.nearbySearchPlaces({ 
    //     location: { lat, lng }, 
    //     radius: "15",
    //     units: ""
    //   })).to.be.rejectedWith(Error);
    // });

    it("should test a fully configured options object", async () => {
      expect(mapWrapInstance.nearbySearchPlaces({
        location: { lat, lng },
        radius: 20000,
        keyword: "cha",
        
        type: "restaurant",
        minprice: -1,
        maxprice: -1,
      })).to.not.be.rejectedWith(Error);
      expect(mapWrapInstance.nearbySearchPlaces({
        location:{ lat, lng },
        radius: 20000,
        keyword: "cha",
        type: "restaurant",
        
        minprice: 1,
        maxprice: -1,
      })).to.be.rejectedWith(Error);
    });
  });

  describe.skip("Testing Nearby Place Search", async () => {

    let mapWrapInstance;
    let response;

    let minprice = -1, maxprice = -1;
    let radius = 49000;
    let type = null;
    let lat = 33.651021, lng = -117.841550;

    let params = {
      location: { lat, lng },
      radius,
      keyword: "starbucks",
      ...type && { type },
      ...(minprice !== -1 && minprice !== undefined) && { minprice },
      ...(maxprice !== -1 && maxprice !== undefined) && { maxprice }, // this needs testing.
    };

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    before("should instantiate mapwrap", () => {
      mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
    });

  
    it("will make a call to the places endpoint and hit the cache", async () => {
      response = await mapWrapInstance.nearbySearchPlaces(params);
      expect(await mapWrapInstance.nearbySearchPlaces(params)).to.be.equal(response);
    });
  
    it("will get the next page token", async () => {
      response = await mapWrapInstance.nearbySearchPlaces(params);
      expect(response.getNextPageToken()).to.be.string();
    });
  
    it("will get all results", async () => {
      response = await mapWrapInstance.nearbySearchPlaces(params);
      expect(response.getResults()).to.be.an("array").that.is.not.empty;
    })

    it("will get next page results", async function() {
      this.timeout(15000);
      response = await mapWrapInstance.nearbySearchPlaces(params);
     
      await sleep(3000); // timeout is necessary because there is a delay before google next page token becomes valid.
     
      const nextPage = await mapWrapInstance.additionalPlaces(response.getNextPageToken());
      expect(await mapWrapInstance.nearbySearchPlaces(params)).to.be.equal(response);
      expect(nextPage).to.not.be.equal(response);
      expect(nextPage.getResults()).to.be.an("array").that.is.not.empty;
    }); 

  });

});