const MapWrap = require("./testUtils").selectEnvTest()
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

describe.skip("MapWrap.placeDetails", async () => {

  let mapWrapInstance;
  let response;

  before("should instantiate mapwrap", () => {
    mapWrapInstance = MapWrap(require("./testUtils").mapwrapDefaultConfig());
  });

  it("should test invalid IDs", () => {

    expect(mapWrapInstance.placeDetails()).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.placeDetails(23)).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.placeDetails({ id: "ChIJJVC1tpjf3IAR33C_RgTYo3888"})).to.be.rejectedWith(TypeError);
    expect(mapWrapInstance.placeDetails("oof")).to.not.be.rejected;
  });

  it("should test a valid place ID", async () => {
    response = await mapWrapInstance.placeDetails("ChIJJVC1tpjf3IAR33C_RgTYo3888");
    expect(response).to.be.object();
  });
});