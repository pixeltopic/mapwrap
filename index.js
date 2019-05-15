const package = require("./package.json");

if (package.version.charAt(0) === "2") {
  console.warn(
    "\x1b[32mIf you are upgrading from MapWrap v1.X.X, you may need to modify your MapWrap config object due to schema changes."
  );
  console.warn(
    "Check out the changelog at https://github.com/pixeltopic/mapwrap/blob/master/CHANGELOG.md",
    "\x1b[0m"
  );
}

module.exports = require("./dist");
