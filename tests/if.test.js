const assert = require("assert");
const Macro = require("../src/index.js");

const text = `#if AMOUNT > 3
#undef AMOUNT
#define AMOUNT 4
#elseif AMOUNT < 2
#undef AMOUNT
#define AMOUNT 1
#else 
#undef AMOUNT
#define AMOUNT 3
#endif
const amount = AMOUNT`;

const nested = `#if AMOUNT > 3
#if SAMOUNT < 3
bad
#else 
good
#endif
#else
ugly
#endif`

describe("If", function () {
    it("Should process true value", function () {
        process.env.AMOUNT = 8;
        const macro = new Macro();
        const parsed = macro.parse(text); 
        assert.equal(parsed.content, "const amount = 4");
    });
    it("Should process alternative true value", function () {
        process.env.AMOUNT = 0;
        const macro = new Macro();
        const parsed = macro.parse(text); 
        assert.equal(parsed.content, "const amount = 1");
    });
    it("Should process false value", function () {
        process.env.AMOUNT = 3;
        const macro = new Macro();
        const parsed = macro.parse(text); 
        assert.equal(parsed.content, "const amount = 3");
    });
    it("Pass nested ifs", function () {
        process.env.AMOUNT = 4;
        process.env.SAMOUNT = 4;
        const macro = new Macro();
        const parsed = macro.parse(nested); 
        assert.equal(parsed.content, "good");
    });
});
