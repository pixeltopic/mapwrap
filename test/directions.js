const MapWrap = require("../lib");
const key = require("../lib/config");
const chai = require("chai");
const asserttype = require("chai-asserttype");
const chaiAsPromised = require("chai-as-promised");

chai.use(asserttype);
chai.use(chaiAsPromised)

const expect = chai.expect;

describe("MapWrap.directions", async () => {
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

  before("should instantiate mapwrap", function() {
    mapWrapInstance = new MapWrap(key.GOOGLE_API_KEY);
  });

  it("should throw a regular error", () => {
    expect(mapWrapInstance.directions({ origin: "Anaheim" })).to.be.rejectedWith(Error);
    expect(mapWrapInstance.directions({ destination: "Irvine" })).to.be.rejectedWith(Error);
  });

  it("should throw a type error", () => {
    expect(mapWrapInstance.directions({ origin: 23, destination: 45})).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.directions({ origin: 34.5, destination: "Irvine" })).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.reverseGeocode({ origin: "Anaheim", destination: 54.3 })).to.be.rejectedWith(TypeError);
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


  // test getRoute
  // make a altRoutes = true request
  // make an invalid origin/destination request
});