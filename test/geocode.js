const MapWrap = require("../lib");
const key = require("../lib/config");
const chai = require("chai");
const asserttype = require("chai-asserttype");
const chaiAsPromised = require("chai-as-promised");

chai.use(asserttype);
chai.use(chaiAsPromised)

const expect = chai.expect;

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