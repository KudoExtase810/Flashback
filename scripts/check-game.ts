// Run: node scripts/check-game.ts
import assert from "node:assert/strict";
import { cooldown } from "../src/lib/game/cooldowns.ts";
import { itemHasteFromDDragon } from "../src/lib/game/items.ts";
import { enemiesFromLive, laneFromLive } from "../src/lib/game/live.ts";
import { parse } from "../src/lib/game/parse.ts";
import { applyPhrase, emptyState, timerKey, toggleCosmic, toggleTimer } from "../src/lib/game/timers.ts";

const s = emptyState();

assert.deepEqual(parse("top f", s.enemies), [{ role: "top", spell: "flash" }]);
assert.deepEqual(parse("Mid TP  jungle flash", s.enemies), [
    { role: "mid", spell: "tp" },
    { role: "jg", spell: "flash" },
]);
assert.deepEqual(parse("f top", s.enemies), []); // order matters: anywhere-mode buffer would re-fire otherwise
assert.deepEqual(parse("gg wp", s.enemies), []);
assert.deepEqual(parse("mid r top e2", s.enemies), []); // abilities aren't tracked
assert.deepEqual(parse("top ex", s.enemies), [{ role: "top", spell: "exhaust" }]);

// No game: no enemies, so callouts do nothing.
assert.deepEqual(s.enemies, []);
assert.equal(applyPhrase(s, "mid tp", 0), s);
assert.equal(applyPhrase(s, "mid ci", 0), s);

// Toggle: start, then clear while running.
const on = toggleTimer(s, "top:flash", 300, 0);
assert.equal(on.timers["top:flash"].end, 300_000);
assert.equal(toggleTimer(on, "top:flash", 300, 1000).timers["top:flash"], undefined);

// Live mode: positions, smite fallback, enemy team, boots haste, champ ids, champ-name targeting.
const spell = (raw: string) => ({ rawDisplayName: `GeneratedTip_SummonerSpell_${raw}_DisplayName` });
const p = (championName: string, team: string, a: string, b: string, position = "", items: number[] = [], level = 1) => ({
    championName, team, position, level, riotId: championName,
    rawChampionName: `game_character_displayname_${championName === "Wukong" ? "MonkeyKing" : championName.replace(/ /g, "")}`,
    items: items.map((itemID) => ({ itemID })),
    summonerSpells: { summonerSpellOne: spell(a), summonerSpellTwo: spell(b) },
});
const itemHaste = itemHasteFromDDragon({
    data: {
        "3158": { description: "<mainText><stats><attention>10</attention> Ability Haste<br><attention>45</attention> Move Speed</stats><br><passive>Ionian Insight</passive><br>Gain 10 Summoner Spell Haste.</mainText>" },
        "3118": { description: "<mainText><stats><attention>15</attention> Ability Haste</stats><passive>Scorn</passive>Gain 20 Ultimate Ability Haste.</mainText>" },
        "1001": { description: "<mainText><stats><attention>25</attention> Move Speed</stats></mainText>" },
        "9999": { description: "<mainText><stats></stats>Gain 10 Ability Haste per legendary item.</mainText>" },
    },
});
assert.deepEqual(itemHaste, { "3158": 10 });
const enemies = enemiesFromLive({
    activePlayer: { riotId: "Lux" },
    allPlayers: [
        p("Lux", "ORDER", "SummonerFlash", "SummonerDot"),
        p("Yasuo", "CHAOS", "SummonerFlash", "SummonerDot", "", [3158, 3118], 11),
        p("Wukong", "CHAOS", "SummonerFlash", "S5_SummonerSmiteDuel"),
        p("Darius", "CHAOS", "SummonerFlash", "S12_SummonerTeleportUpgrade", "TOP"),
        p("Jinx", "CHAOS", "SummonerFlash", "SummonerHeal"),
        p("Thresh", "CHAOS", "SummonerFlash", "SummonerExhaust"),
    ],
}, itemHaste);
const yas = enemies.find((e) => e.id === "Yasuo")!;
assert.equal(yas.summonerHaste, 10);
assert.deepEqual(enemies.map((e) => `${e.role}:${e.id}`), [
    "top:Darius", "jg:MonkeyKing", "mid:Yasuo", "adc:Jinx", "sup:Thresh",
]);
assert.deepEqual(enemies[0].spells, ["flash", "tp"]);

// Lane opponent: your position, else the only enemy, else unknown.
const me = p("Lux", "ORDER", "SummonerFlash", "SummonerDot", "MIDDLE");
const lane = (pos: string, list = enemies) => laneFromLive({ activePlayer: { riotId: "Lux" }, allPlayers: [{ ...me, position: pos }] }, list);
assert.equal(lane("MIDDLE"), "mid");
assert.equal(lane("UTILITY"), "sup");
assert.equal(lane(""), null);
assert.equal(lane("", [enemies[2]]), "mid");


const live = {
    live: true,
    enemies,
    timers: {},
    cosmic: [] as ("top" | "jg" | "mid" | "adc" | "sup")[],
};
const y = applyPhrase(live, "yas f yas r", 0);
assert.deepEqual(Object.keys(y.timers), ["mid:flash"]);
assert.equal(y.timers[timerKey("mid", "flash")].cd, cooldown("flash", 10));
assert.equal(cooldown("flash", 10), 273);
// "clear" removes only the pair right after it; nothing to clear leaves the state untouched.
const two = applyPhrase(live, "top f mid f", 0);
assert.deepEqual(Object.keys(applyPhrase(two, "clear yas flash top f", 5000).timers), ["top:flash"]);
assert.equal(applyPhrase(two, "clear yas flash top f", 5000).timers["top:flash"].end, 5000 + 300_000);
assert.equal(applyPhrase(live, "clear mid f", 0), live);
assert.equal(applyPhrase(live, "top ghost", 0), live); // Darius has no Ghost
assert.equal(applyPhrase(live, "hello", 0), live);

// Cosmic Insight: +18 summoner haste on top of items; running timers rescale on toggle.
assert.deepEqual(parse("mid ci sup cosmic", s.enemies), [{ role: "mid", cosmic: true }, { role: "sup", cosmic: true }]);
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

console.log("game.ts ok");

// Shortcut names recorded in the webview must match what rdev reports in game.
import { shortcutFromButton, shortcutFromCode, shortcutLabel } from "../src/lib/input/shortcut.ts";
assert.equal(shortcutFromCode("KeyG"), "KeyG");
assert.equal(shortcutFromCode("Digit5"), "Num5");
assert.equal(shortcutFromCode("Numpad0"), "Kp0");
assert.equal(shortcutFromCode("F7"), "F7");
assert.equal(shortcutFromCode("F13"), "Unknown(124)");
assert.equal(shortcutFromCode("Period"), "Dot");
assert.equal(shortcutFromCode("AltLeft"), "Alt");
assert.equal(shortcutFromCode("LaunchMail"), undefined);
assert.equal(shortcutFromButton(0), undefined);
assert.equal(shortcutFromButton(3), "MouseUnknown(1)");
assert.deepEqual(["KeyG", "Kp0", "MouseUnknown(1)", "MouseUnknown(2)", "Unknown(124)", "F7"].map(shortcutLabel), ["G", "Numpad 0", "Mouse 4", "Mouse 5", "F13", "F7"]);
console.log("shortcut ok");
