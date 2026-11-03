import { test } from "node:test";
import assert from "node:assert/strict";
import { cooldown } from "./cooldowns.ts";
import { applyPhrase, emptyState, timerKey, toggleCosmic, toggleTimer } from "./timers.ts";
import type { Enemy, GameState } from "./types.ts";

const enemy = (role: Enemy["role"], champ: string, spells: Enemy["spells"], summonerHaste = 0): Enemy => ({
    role, champ, id: champ, level: 1, spells, summonerHaste,
});
const live: GameState = {
    live: true,
    lane: null,
    timers: {},
    cosmic: [],
    enemies: [
        enemy("top", "Darius", ["flash", "tp"]),
        enemy("jg", "Wukong", ["flash", "smite"]),
        enemy("mid", "Yasuo", ["flash", "ignite"], 10), // Ionian boots
        enemy("adc", "Jinx", ["flash", "heal"]),
        enemy("sup", "Thresh", ["flash", "exhaust"]),
    ],
};

test("no game: callouts do nothing", () => {
    const s = emptyState();
    assert.equal(applyPhrase(s, "mid tp", 0), s);
    assert.equal(applyPhrase(s, "mid ci", 0), s);
});

test("toggle: start, then clear while running", () => {
    const on = toggleTimer(emptyState(), "top:flash", 300, 0);
    assert.equal(on.timers["top:flash"].end, 300_000);
    assert.equal(toggleTimer(on, "top:flash", 300, 1000).timers["top:flash"], undefined);
});

test("champion names and haste", () => {
    const y = applyPhrase(live, "yas f yas r", 0);
    assert.deepEqual(Object.keys(y.timers), ["mid:flash"]);
    assert.equal(y.timers[timerKey("mid", "flash")].cd, cooldown("flash", 10));
    assert.equal(cooldown("flash", 10), 273);
});

test("clear removes only its own pair", () => {
    const two = applyPhrase(live, "top f mid f", 0);
    const next = applyPhrase(two, "yas flash clear top f", 5000);
    assert.deepEqual(Object.keys(next.timers), ["top:flash"]);
    assert.equal(next.timers["top:flash"].end, 5000 + 300_000);
    assert.equal(applyPhrase(live, "mid f clear", 0), live); // nothing to clear
});

test("ignores spells the enemy doesn't have", () => {
    assert.equal(applyPhrase(live, "top ghost", 0), live);
    assert.equal(applyPhrase(live, "hello", 0), live);
});

test("cosmic insight: +18 haste, running timers rescale", () => {
    const flashed = applyPhrase(live, "yas f", 0); // 300 * 100/110 = 273
    const ci = toggleCosmic(flashed, "mid", 73_000); // 200s left of 273 -> 200 * 234/273
    assert.deepEqual(ci.cosmic, ["mid"]);
    assert.equal(ci.timers[timerKey("mid", "flash")].cd, 234); // 300 * 100/128
    assert.equal(Math.round(ci.timers[timerKey("mid", "flash")].end), 73_000 + Math.round((200_000 * 234) / 273));
    assert.equal(applyPhrase({ ...live, cosmic: ["mid"] }, "mid f", 0).timers[timerKey("mid", "flash")].cd, 234);
    const off = toggleCosmic(ci, "mid", 73_000);
    assert.deepEqual(off.cosmic, []);
    assert.equal(Math.round(off.timers[timerKey("mid", "flash")].end), 273_000); // back to the original
    assert.deepEqual(applyPhrase(live, "mid ci", 0).cosmic, ["mid"]);
});

test("called late", () => {
    assert.equal(applyPhrase(live, "top f 10", 0).timers["top:flash"].end, 290_000);
    assert.equal(applyPhrase(live, "top f 300", 0), live); // as late as the cooldown: already back
});