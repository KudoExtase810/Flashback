import { test } from "node:test";
import assert from "node:assert/strict";
import { itemHasteFromDDragon } from "./items.ts";
import { enemiesFromLive, laneFromLive } from "./live.ts";

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

test("item haste: only summoner spell haste counts", () => {
    assert.deepEqual(itemHaste, { "3158": 10 });
    assert.equal(enemies.find((e) => e.id === "Yasuo")!.summonerHaste, 10);
});

test("enemy roles: positions, smite -> jungle, then list order", () => {
    assert.deepEqual(enemies.map((e) => `${e.role}:${e.id}`), [
        "top:Darius", "jg:MonkeyKing", "mid:Yasuo", "adc:Jinx", "sup:Thresh",
    ]);
    assert.deepEqual(enemies[0].spells, ["flash", "tp"]);
});

test("lane opponent: your position, else the only enemy, else unknown", () => {
    const me = p("Lux", "ORDER", "SummonerFlash", "SummonerDot", "MIDDLE");
    const lane = (pos: string, list = enemies) =>
        laneFromLive({ activePlayer: { riotId: "Lux" }, allPlayers: [{ ...me, position: pos }] }, list);
    assert.equal(lane("MIDDLE"), "mid");
    assert.equal(lane("UTILITY"), "sup");
    assert.equal(lane(""), null);
    assert.equal(lane("", [enemies[2]]), "mid");
});
