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

describe("MapWrap.directions", async () => {
  
  describe.skip("Testing with altRoutes disabled", async () => {
    let params = {
      "altRoutes": false,
      "avoidFerries": false,
      "avoidHighways": false,
      "avoidIndoor": false,
      "avoidTolls": false,
      "destination": "Irvine",
      "mode": "driving",
      "origin": "Anaheim",
      "units": "imperial"
    }
    let mapWrapInstance;
    let response;

    before("should instantiate mapwrap", () => {
      mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
    });

    it("should throw an error", async () => {
      expect(mapWrapInstance.directions({ origin: "Anaheim" })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.directions({ destination: "Irvine" })).to.be.rejectedWith(Error);
    });
  
    it("should throw an error", async () => {
      expect(mapWrapInstance.directions({ origin: 23, destination: 45})).to.be.rejectedWith(Error);
      expect(mapWrapInstance.directions({ origin: 34.5, destination: "Irvine" })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.reverseGeocode({ origin: "Anaheim", destination: 54.3 })).to.be.rejectedWith(Error);
    });

    it("should not allow incorrect mode with avoid indoors", async () => {
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "walking", avoidIndoor: true })).to.not.be.rejectedWith(Error);
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "driving", avoidIndoor: true })).to.be.rejectedWith(Error);
    });

    it("should not allow non-boolean values in avoid keys", async () => {
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "driving", avoidTolls: "hey" })).to.be.rejectedWith(Error);
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "driving", avoidTolls: true })).to.not.be.rejectedWith(Error);
    });

    it("should properly restrict modes of travel", async () => {
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "driving" })).to.not.be.rejectedWith(Error);
      expect(mapWrapInstance.directions({ origin: "Anaheim", destination: "Irvine", mode: "fishing" })).to.be.rejectedWith(Error);
    });
  
    it("should test DirectionsWrapper.getStartAddress", async () => {
      response = await mapWrapInstance.directions(params)
      expect(response.getStartAddress()).to.be.string();
      expect(response.getStartAddress(1)).to.be.null;
      expect(response.getStartAddress(-1)).to.be.null;
    });
  
    it("should test DirectionsWrapper.getEndAddress", async () => {
      response = await mapWrapInstance.directions(params);
      expect(response.getEndAddress()).to.be.string();
      expect(response.getEndAddress(1)).to.be.null;
      expect(response.getEndAddress(-1)).to.be.null;
    });
  
    it("should get route 0", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute();
      
      expect(route).to.be.object();
      expect(route).to.have.property("bounds");
      expect(route.bounds).to.be.object();
      expect(route.bounds).to.have.property("northeast");
  
      expect(route).to.have.property("overview_polyline");
      expect(route.overview_polyline).to.have.property("points");
  
      expect(route).to.have.property("legs");
      expect(route.legs).to.be.array();
      expect(route.legs[0]).to.be.object();
    });

    it("should fail on route 1", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute(1);

      expect(route).to.be.null;
    });

    it("should get route 0 steps", async () => {
      response = await mapWrapInstance.directions(params);
      const routeSteps = response.getRouteSteps();

      expect(routeSteps).to.be.array();
      expect(routeSteps).to.have.length.greaterThan(0, "The steps array was empty");

      expect(routeSteps[0]).to.have.property("distance");
      expect(routeSteps[0]).to.have.property("duration");
      expect(routeSteps[0]).to.have.property("end_location");
      expect(routeSteps[0]).to.have.property("start_location");

    });

    it("should fail on route 1 again", async () => {
      response = await mapWrapInstance.directions(params);
      const routeSteps = response.getRouteSteps(1);

      expect(routeSteps).to.be.null;
    });
  
    it("should test getRoutes", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute();
      const routes = response.getRoutes();
  
      expect(route).to.be.object();
  
      expect(routes).to.be.array();
      expect(routes).to.have.length.greaterThan(0, "The route array was empty");
      
      expect(routes[0]).to.deep.equal(route, "routes[0] and route should return the same object");
    });
  });

  describe.skip("Testing Searches with fake locations", async () => {
    let params = {
      "altRoutes": false,
      "avoidFerries": false,
      "avoidHighways": false,
      "avoidIndoor": false,
      "avoidTolls": false,
      "destination": "Some fake place",
      "mode": "driving",
      "origin": "Another fake place",
      "units": "imperial"
    }
    let mapWrapInstance;
    let response;

    before("should instantiate mapwrap", () => {
      mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
    });

    it("should test combinations of destination and origin that are not real locations", async () => {
      params.origin = "Another fake place";
      params.destination = "Some fake place";
      
      response = await mapWrapInstance.directions(params);
      
      expect(response._routes).to.be.an("array").that.is.empty;

      params.origin = "Another fake place";
      params.destination = "Irvine";
      
      response = await mapWrapInstance.directions(params);
      
      expect(response._routes).to.be.an("array").that.is.empty;
     

      params.origin = "Anaheim";
      params.destination = "Some fake place";

      response = await mapWrapInstance.directions(params);
      
      expect(response._routes).to.be.an("array").that.is.empty;
      
    });

    it("should test DirectionsWrapper methods with no results", async () => {
      params.origin = "Another fake place";
      params.destination = "Some fake place";
      
      response = await mapWrapInstance.directions(params);

      expect(response.getStartAddress()).to.be.null;
      expect(response.getEndAddress()).to.be.null;
      expect(response.getRoute()).to.be.null;
      expect(response.getRoute(2)).to.be.null;
      expect(response.getRoute(3)).to.be.null;
      expect(response.getRouteSteps()).to.be.null;
      expect(response.getRouteSteps(2)).to.be.null;
      expect(response.getRouteSteps(3)).to.be.null;
      expect(response.getRoutes()).to.be.an("array").that.is.empty;
    });
  })

  describe.skip("Testing with altRoutes enabled", async () => {
    let params = {
      "altRoutes": true,
      "destination": "Irvine",
      "mode": "driving",
      "origin": "Anaheim",
      "units": "imperial"
    }
    let mapWrapInstance;
    let response;

    before("should instantiate mapwrap", () => {
      mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
    });

    it("should test DirectionsWrapper.getStartAddress", async () => {
      response = await mapWrapInstance.directions(params)
      expect(response.getStartAddress()).to.be.string();
      expect(response.getStartAddress(1)).to.be.string();
      expect(response.getStartAddress(-1)).to.be.null;
    });
  
    it("should test DirectionsWrapper.getEndAddress", async () => {
      response = await mapWrapInstance.directions(params);
      expect(response.getEndAddress()).to.be.string();
      expect(response.getEndAddress(1)).to.be.string();
      expect(response.getEndAddress(-1)).to.be.null;
    });

    it("should get route 0", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute();
      
      expect(route).to.be.object();
      expect(route).to.have.property("bounds");
      expect(route.bounds).to.be.object();
      expect(route.bounds).to.have.property("northeast");
  
      expect(route).to.have.property("overview_polyline");
      expect(route.overview_polyline).to.have.property("points");
  
      expect(route).to.have.property("legs");
      expect(route.legs).to.be.array();
      expect(route.legs[0]).to.be.object();
    });

    it("should get route 1", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute(1);
      
      expect(route).to.be.object();
      expect(route).to.have.property("bounds");
      expect(route.bounds).to.be.object();
      expect(route.bounds).to.have.property("northeast");
  
      expect(route).to.have.property("overview_polyline");
      expect(route.overview_polyline).to.have.property("points");
  
      expect(route).to.have.property("legs");
      expect(route.legs).to.be.array();
      expect(route.legs[0]).to.be.object();
    });

    it("should fail on route 4", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute(4);

      expect(route).to.be.null;
    });

    it("should get route 0 steps", async () => {
      response = await mapWrapInstance.directions(params);
      const routeSteps = response.getRouteSteps();

      expect(routeSteps).to.be.array();
      expect(routeSteps).to.have.length.greaterThan(0, "The steps array was empty");

      expect(routeSteps[0]).to.have.property("distance");
      expect(routeSteps[0]).to.have.property("duration");
      expect(routeSteps[0]).to.have.property("end_location");
      expect(routeSteps[0]).to.have.property("start_location");
    });

    it("should get route 1 steps", async () => {
      response = await mapWrapInstance.directions(params);
      const routeSteps = response.getRouteSteps(1);

      expect(routeSteps).to.be.array();
      expect(routeSteps).to.have.length.greaterThan(0, "The steps array was empty");

      expect(routeSteps[0]).to.have.property("distance");
      expect(routeSteps[0]).to.have.property("duration");
      expect(routeSteps[0]).to.have.property("end_location");
      expect(routeSteps[0]).to.have.property("start_location");
    });


    it("should fail on route 4 again", async () => {
      response = await mapWrapInstance.directions(params);
      const routeSteps = response.getRouteSteps(4);

      expect(routeSteps).to.be.null;
    });
  
    it("should test getRoutes", async () => {
      response = await mapWrapInstance.directions(params);
      const route = response.getRoute();
      const routes = response.getRoutes();
  
      expect(route).to.be.object();
  
      expect(routes).to.be.array();
      expect(routes).to.have.length.greaterThan(0, "The route array was empty");
      
      expect(routes[0]).to.deep.equal(route, "routes[0] and route should return the same object");
    });
  });
});