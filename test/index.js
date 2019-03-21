const MapWrap = require("../lib");
const key = require("../lib/config");
const chai = require("chai");
const asserttype = require("chai-asserttype");
chai.use(asserttype);

const expect = chai.expect;

describe('Reverse Geocoding Tests', function () {
  let mapWrapInstance;
  let response;

  it ("Should instantiate mapwrap", function() {
    mapWrapInstance = new MapWrap(key.GOOGLE_API_KEY);
  });

  it ("Should make a request with a lat lng", async function() {
    response = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
  });

  it ("Should get all the address results", function(){
    const addrResults = response.getAllAddresses();
    expect(addrResults).to.be.array();
    expect(addrResults).to.have.length.greaterThan(0, "The address array was empty");
  });

  it ("Should test functionality of getTopAddress", function() {
    const addrObj = response.getTopAddress();
    // console.log(addrObj);
    expect(addrObj).to.be.object();
    expect(addrObj).to.have.property("formatted_address");
    expect(addrObj).to.have.property("geometry");

    const addrStr = response.getTopAddress(true);
    expect(addrStr).to.be.string();
  });

  it ("Should retrieve a cached object", async function() {
    const cached = await mapWrapInstance.reverseGeocode(33.651021, -117.841550);
    expect(cached).to.be.equal(response);

  });
});
