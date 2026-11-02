import { cooldown, summonerHaste } from "./cooldowns.ts";
import { parse } from "./parse.ts";
import type { GameState, Role, SpellId } from "./types.ts";

/** No game running: no enemies, nothing to track. */
export const emptyState = (): GameState => ({ live: false, enemies: [], timers: {}, cosmic: [], lane: null });

export const timerKey = (role: Role, spell: SpellId) => `${role}:${spell}`;

/** Starts (or, after "clear", removes) timers for every command in the phrase. Same object if nothing matched. */
export function applyPhrase(state: GameState, phrase: string, now: number): GameState {
    let timers = { ...state.timers };
    let changed = false;
    for (const cmd of parse(phrase, state.enemies)) {
        const enemy = state.enemies.find((e) => e.role === cmd.role);
        if (!enemy) continue; // no game: no enemies, nothing to time
        if ("cosmic" in cmd) {
            const next = toggleCosmic({ ...state, timers }, cmd.role, now);
            timers = next.timers;
            state = { ...state, cosmic: next.cosmic };
            changed = true;
            continue;
        }
        const { spell } = cmd;
        const key = timerKey(cmd.role, spell);
        if (cmd.clear) {
            if (!timers[key]) continue;
            delete timers[key];
            changed = true;
            continue;
        }
        if (!enemy.spells.includes(spell)) continue; // live data says they don't have it
        const cd = cooldown(spell, summonerHaste(state, enemy));
        timers[key] = { end: now + cd * 1000, cd };
        changed = true;
    }
    return changed ? { ...state, timers } : state;
}

/**
 * Marks/unmarks Cosmic Insight for a role. Running summoner timers rescale like in game:
 * the time left shrinks or grows by the ratio of new to old cooldown.
 */
export function toggleCosmic(state: GameState, role: Role, now: number): GameState {
    const on = !state.cosmic.includes(role);
    const cosmic = on ? [...state.cosmic, role] : state.cosmic.filter((r) => r !== role);
    const next = { ...state, cosmic, timers: { ...state.timers } };
    const enemy = state.enemies.find((e) => e.role === role);
    for (const spell of enemy?.spells ?? []) {
        const key = timerKey(role, spell);
        const t = next.timers[key];
        if (!enemy || !t || t.end <= now) continue;
        const cd = cooldown(spell, summonerHaste(next, enemy));
        next.timers[key] = { end: now + (t.end - now) * (cd / t.cd), cd };
    }
    return next;
}

/** Starts the timer, or clears it if it's running. */
export function toggleTimer(state: GameState, key: string, cd: number, now: number): GameState {
    const timers = { ...state.timers };
    if ((timers[key]?.end ?? 0) > now) delete timers[key];
    else timers[key] = { end: now + cd * 1000, cd };
    return { ...state, timers };
}

/** "4:12" above a minute, "45" below. */
export const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000);
    return s < 60 ? String(s) : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
