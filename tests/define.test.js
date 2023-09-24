const assert = require("assert");
const Macro = require("../src/index.js");

const text = `#define PI 3.1415
#define MAX(a, b) a >= b ? a : b
const foo = (MAX(PI, "ba)r")) + 10`;
const macro = new Macro();
const parsed = macro.parse(text);
describe("Define", function () {
  it("Should set variable", function () {
    assert(macro.context.variables['\\bPI\\b'] != undefined);
  });
  it("Should process variable", function () {
    assert.equal(macro.parse("PI").content, "3.1415");
  });
  it("Should set function", function () { 
    assert(macro.context.variables['MAXs*\\((.*?)\\)'] != undefined);
  });
  it("Should process function", function () {
    assert.equal(parsed.content, 'const foo = (3.1415 >= "ba)r" ? 3.1415 : "ba)r") + 10');
  });
});
