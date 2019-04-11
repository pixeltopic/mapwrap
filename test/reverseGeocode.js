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

describe.skip("MapWrap.reverseGeocode", () => {
  let mapWrapInstance;
  let response;

  before("should instantiate mapwrap", () => {
    mapWrapInstance = MapWrap(GOOGLE_API_KEY);
  });

  it("should get all the address results", async () => {
    response = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    const addrResults = response.getAllAddresses();
    expect(addrResults).to.be.array();
    expect(addrResults).to.have.length.greaterThan(0, "The address array was empty");
  });

  it("should test functionality of getTopAddress", async () => {
    response = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    const addrObj = response.getTopAddress();
    // console.log(addrObj);
    expect(addrObj).to.be.object();
    expect(addrObj).to.have.property("lat");
    expect(addrObj).to.have.property("lng");

    const addrStr = response.getTopAddress(true);
    expect(addrStr).to.be.string();
  });

  it("should retrieve a cached object", async () => {
    response = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    const cached = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    expect(cached).to.be.equal(response);
  });

  it("should attempt to find a nonexistent location", () => {
      expect(mapWrapInstance.reverseGeocode(9999999, 9999999)).to.be.rejectedWith(Error);
  });

  it("should throw a type error", () => {
    expect(mapWrapInstance.reverseGeocode("33.65", "-117.841")).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.reverseGeocode(33.65, "-117.841")).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.reverseGeocode("33.65", -117.841)).to.be.rejectedWith(TypeError);
    expect(() => mapWrapInstance.reverseGeocode(33.651021, -117.841550)).to.not.throw();
  });
});