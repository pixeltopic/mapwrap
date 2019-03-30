const MapWrap = require("../lib");
const key = require("../lib/config");
const chai = require("chai");
const asserttype = require("chai-asserttype");
const chaiAsPromised = require("chai-as-promised");

chai.use(asserttype);
chai.use(chaiAsPromised)



const expect = chai.expect;

describe("MapWrap", () => {
  it("should throw an error", () => {
    expect(() => new MapWrap()).to.throw();
  });
  it("should not throw an error", () => {
    expect(() => new MapWrap(key.GOOGLE_API_KEY)).to.not.throw();
  });
});

describe.skip("MapWrap.geocode", () => {
  let mapWrapInstance;
  let response;

  before("should instantiate mapwrap", function() {
    mapWrapInstance = new MapWrap(key.GOOGLE_API_KEY);
  });

  it("should throw a type error", () => {
    expect(mapWrapInstance.geocode()).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.geocode(12)).to.be.rejectedWith(TypeError);
    expect(() => mapWrapInstance.geocode("Campus Drive Irvine")).to.not.throw();
  });

  it("should make a request with an address", async () => {
    response = await mapWrapInstance.geocode("Campus Drive Irvine");
  });

  it("should get all the address results", () => {
    const addrResults = response.getAllAddresses();
    expect(addrResults).to.be.array();
    expect(addrResults).to.have.length.greaterThan(0, "The address array was empty");
  });

  it("should test functionality of getTopAddress", () => {
    const addrObj = response.getTopAddress();
    // console.log(addrObj);
    expect(addrObj).to.be.object();
    expect(addrObj).to.have.property("lat");
    expect(addrObj).to.have.property("lng");

    const addrStr = response.getTopAddress(true);
    expect(addrStr).to.be.string();
  });

  it("should retrieve a cached object", async () => {
    const cached = await mapWrapInstance.geocode("Campus Drive Irvine");
    expect(cached).to.be.equal(response);

  });

  it("should attempt to find a nonexistent location", async () => {
    response = await mapWrapInstance.geocode("Vyn, Enderal");
    expect(response.getAllAddresses()).to.be.an("array").that.is.empty;
    expect(response.getTopAddress()).to.be.null;
  });
});


describe.skip("MapWrap.reverseGeocode", () => {
  let mapWrapInstance;
  let response;

  before("should instantiate mapwrap", function() {
    mapWrapInstance = new MapWrap(key.GOOGLE_API_KEY);
  });

  it("should make a request with a lat lng", async () => {
    response = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
  });

  it("should get all the address results", () => {
    const addrResults = response.getAllAddresses();
    expect(addrResults).to.be.array();
    expect(addrResults).to.have.length.greaterThan(0, "The address array was empty");
  });

  it("should test functionality of getTopAddress", () => {
    const addrObj = response.getTopAddress();
    // console.log(addrObj);
    expect(addrObj).to.be.object();
    expect(addrObj).to.have.property("lat");
    expect(addrObj).to.have.property("lng");

    const addrStr = response.getTopAddress(true);
    expect(addrStr).to.be.string();
  });

  it("should retrieve a cached object", async () => {
    const cached = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    expect(cached).to.be.equal(response);

  });

  it("should attempt to find a nonexistent location", async () => {
    response = await mapWrapInstance.reverseGeocode(9999999, 9999999);
    expect(response.getAllAddresses()).to.be.an("array").that.is.empty;
    expect(response.getTopAddress()).to.be.null;
  });

  it("should throw a type error", () => {
    expect(mapWrapInstance.reverseGeocode("33.65", "-117.841")).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.reverseGeocode(33.65, "-117.841")).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.reverseGeocode("33.65", -117.841)).to.be.rejectedWith(TypeError);
    expect(() => mapWrapInstance.reverseGeocode(33.651021, -117.841550)).to.not.throw();
  });
});

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