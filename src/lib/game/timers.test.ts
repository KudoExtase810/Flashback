import { test } from "node:test";
import assert from "node:assert/strict";
import { cooldown } from "./cooldowns.ts";
import { clearTimer, emptyState, shiftTimer, startTimer, timerKey, toggleCosmic } from "./timers.ts";
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

test("no game: nothing to start", () => {
    const s = emptyState();
    assert.equal(startTimer(s, "mid", "tp", 0), s);
});

test("start uses the enemy's haste", () => {
    const y = startTimer(live, "mid", "flash", 0);
    assert.equal(y.timers[timerKey("mid", "flash")].cd, cooldown("flash", 10));
    assert.equal(cooldown("flash", 10), 273);
    assert.equal(startTimer(live, "top", "flash", 1000).timers["top:flash"].end, 1000 + 300_000);
});

test("ignores spells the enemy doesn't have", () => {
    assert.equal(startTimer(live, "top", "ghost", 0), live);
});

test("clear marks it up; nothing to clear leaves the state alone", () => {
    const on = startTimer(live, "top", "flash", 0);
    assert.equal(clearTimer(on, "top:flash").timers["top:flash"], undefined);
    assert.equal(clearTimer(live, "top:flash"), live);
});

test("shift takes time off a running timer, past zero it's up", () => {
    const on = startTimer(live, "top", "flash", 0); // ends at 300s
    assert.equal(shiftTimer(on, "top:flash", 5000, 0).timers["top:flash"].end, 295_000);
    assert.equal(shiftTimer(on, "top:flash", 5000, 299_000).timers["top:flash"], undefined);
    assert.equal(shiftTimer(live, "top:flash", 5000, 0), live); // not running
});

test("cosmic insight: +18 haste, running timers rescale", () => {
    const flashed = startTimer(live, "mid", "flash", 0); // 300 * 100/110 = 273
    const ci = toggleCosmic(flashed, "mid", 73_000); // 200s left of 273 -> 200 * 234/273
    assert.deepEqual(ci.cosmic, ["mid"]);
    assert.equal(ci.timers[timerKey("mid", "flash")].cd, 234); // 300 * 100/128
    assert.equal(Math.round(ci.timers[timerKey("mid", "flash")].end), 73_000 + Math.round((200_000 * 234) / 273));
    assert.equal(startTimer({ ...live, cosmic: ["mid"] }, "mid", "flash", 0).timers[timerKey("mid", "flash")].cd, 234);
    const off = toggleCosmic(ci, "mid", 73_000);
    assert.deepEqual(off.cosmic, []);
    assert.equal(Math.round(off.timers[timerKey("mid", "flash")].end), 273_000); // back to the original
});
