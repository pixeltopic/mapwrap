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