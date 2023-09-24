const path = require('path');
require('dotenv').config({path: path.join(__dirname,'.env')})
const assert = require('assert');
const Macro = require('../src/index.js');
describe('Dotenv', function () {
    it('Should have .env variable', function () {
      const macro = new Macro();
      assert.equal(macro.parse("TESTVAR TESTVARVAR").content, "The test value TESTVARVAR");
    });
});