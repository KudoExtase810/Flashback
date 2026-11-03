import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "./parse.ts";

test("role + spell", () => {
    assert.deepEqual(parse("top f", []), [{ role: "top", spell: "flash" }]);
    assert.deepEqual(parse("top ex", []), [{ role: "top", spell: "exhaust" }]);
});

test("several callouts in one message", () => {
    assert.deepEqual(parse("Mid TP  jungle flash", []), [
        { role: "mid", spell: "tp" },
        { role: "jg", spell: "flash" },
    ]);
});

test("ignores what isn't a callout", () => {
    assert.deepEqual(parse("f top", []), []); // order matters
    assert.deepEqual(parse("gg wp", []), []);
    assert.deepEqual(parse("mid r top e2", []), []); // abilities aren't tracked
});

test("seconds late", () => {
    assert.deepEqual(parse("top f 10 mid tp", []), [
        { role: "top", spell: "flash", late: 10 },
        { role: "mid", spell: "tp" },
    ]);
});

test("clear goes after the spell, like the seconds", () => {
    assert.deepEqual(parse("mid f clear", []), [{ role: "mid", spell: "flash", clear: true }]);
    assert.deepEqual(parse("mid f clear top tp", []), [
        { role: "mid", spell: "flash", clear: true },
        { role: "top", spell: "tp" },
    ]);
    assert.deepEqual(parse("clear mid f", []), [{ role: "mid", spell: "flash" }]); // the old order is just a callout
});

test("cosmic insight", () => {
    assert.deepEqual(parse("mid ci sup cosmic", []), [
        { role: "mid", cosmic: true },
        { role: "sup", cosmic: true },
    ]);
});
