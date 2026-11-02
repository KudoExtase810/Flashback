// Maps the Live Client API (https://127.0.0.1:2999/liveclientdata/allgamedata) to enemies.
import { ROLES, SPELLS } from "./data.ts";
import { sumHaste } from "./items.ts";
import type { Enemy, ItemHaste, Role, SpellId } from "./types.ts";

type LivePlayer = {
    championName: string;
    rawChampionName?: string;
    team: string;
    level?: number;
    position?: string;
    riotId?: string;
    summonerName?: string;
    items?: { itemID: number }[];
    summonerSpells?: Record<string, { rawDisplayName?: string }>;
};

export type LiveData = {
    activePlayer?: { riotId?: string; summonerName?: string };
    allPlayers: LivePlayer[];
};

const POSITIONS: Record<string, Role> = {
    TOP: "top", JUNGLE: "jg", MIDDLE: "mid", BOTTOM: "adc", UTILITY: "sup",
};

// rawDisplayName looks like "GeneratedTip_SummonerSpell_SummonerFlash_DisplayName".
const spellFromRaw = (raw = "") =>
    (Object.keys(SPELLS) as SpellId[]).find((id) => raw.includes(SPELLS[id].icon));

const idOf = (p: { riotId?: string; summonerName?: string } = {}) => p.riotId || p.summonerName;

/**
 * Your lane opponent's role: the enemy in your position. Practice Tool and blind pick have no
 * positions; with a single enemy that's the one, otherwise null.
 */
export function laneFromLive(data: LiveData, enemies: Enemy[]): Role | null {
    const me = data.allPlayers.find((p) => idOf(p) === idOf(data.activePlayer));
    const role = POSITIONS[me?.position ?? ""] ?? (enemies.length === 1 ? enemies[0].role : undefined);
    return enemies.some((e) => e.role === role) ? role! : null;
}

/** Enemy team with roles, spells and item summoner haste. */
export function enemiesFromLive(data: LiveData, itemHaste: ItemHaste = {}): Enemy[] {
    const myTeam = data.allPlayers.find((p) => idOf(p) === idOf(data.activePlayer))?.team ?? "ORDER";
    const players = data.allPlayers.filter((p) => p.team !== myTeam);

    const spellsOf = (p: LivePlayer) =>
        Object.values(p.summonerSpells ?? {})
            .map((s) => spellFromRaw(s.rawDisplayName))
            .filter((s): s is SpellId => !!s);

    // Positions when the API has them (ranked/draft), smite -> jungle, then list order.
    const roles = new Map<LivePlayer, Role>();
    const take = (p: LivePlayer, r: Role | undefined) => {
        if (r && !roles.has(p) && ![...roles.values()].includes(r)) roles.set(p, r);
    };
    players.forEach((p) => take(p, POSITIONS[p.position ?? ""]));
    players.forEach((p) => spellsOf(p).includes("smite") && take(p, "jg"));
    players.forEach((p) => take(p, ROLES.find((r) => ![...roles.values()].includes(r))));

    return players
        .filter((p) => roles.has(p))
        .map((p) => ({
            role: roles.get(p)!,
            champ: p.championName,
            // "game_character_displayname_MonkeyKing" -> "MonkeyKing"
            id: p.rawChampionName?.split("_").pop() || p.championName.replace(/[^A-Za-z]/g, ""),
            level: p.level ?? 1,
            spells: spellsOf(p),
            summonerHaste: sumHaste(p.items ?? [], itemHaste),
        }))
        .sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role));
}
