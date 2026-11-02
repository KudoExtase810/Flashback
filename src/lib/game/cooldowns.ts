import { COSMIC_INSIGHT_HASTE, SPELLS } from "./data.ts";
import type { Enemy, GameState, SpellId } from "./types.ts";

/** League's haste formula: 100 haste halves a cooldown, with diminishing returns per point. */
export const hasted = (base: number, haste: number) => (base * 100) / (100 + haste);

/** Item summoner haste plus Cosmic Insight when the player marked it. */
export const summonerHaste = (state: GameState, enemy: Enemy) =>
    enemy.summonerHaste + (state.cosmic.includes(enemy.role) ? COSMIC_INSIGHT_HASTE : 0);

export const cooldown = (spell: SpellId, haste: number) => Math.round(hasted(SPELLS[spell].cd, haste));
