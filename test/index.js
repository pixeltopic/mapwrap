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
    expect(() => MapWrap(null, -1)).to.throw();
    expect(() => MapWrap(GOOGLE_API_KEY, -1)).to.throw();
  });
  it("should not throw an error", () => {
    expect(() => MapWrap(GOOGLE_API_KEY)).to.not.throw();
    expect(() => MapWrap(GOOGLE_API_KEY, 15)).to.not.throw();
  });
});