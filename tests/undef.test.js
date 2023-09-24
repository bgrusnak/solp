const assert = require("assert");
const Macro = require("../src/index.js");

const text = `#define PI 3.1415
PI
#undef PI
PI`;
const macro = new Macro({processEnv:false});
const parsed = macro.parse(text); 
describe("Undef", function () {
  it("Should not find variable after undef", function () {
    assert.equal(parsed.content, '3.1415\nPI');
  });
});
