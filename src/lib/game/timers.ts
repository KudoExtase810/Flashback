import { cooldown, summonerHaste } from "./cooldowns.ts";
import type { GameState, Role, SpellId } from "./types.ts";

/** No game running: no enemies, nothing to track. */
export const emptyState = (): GameState => ({ live: false, enemies: [], timers: {}, cosmic: [], lane: null });

export const timerKey = (role: Role, spell: SpellId) => `${role}:${spell}`;

const running = (state: GameState, key: string, now: number) => (state.timers[key]?.end ?? 0) > now;

/** (Re)starts a spell's timer with the enemy's current haste. Same object if they don't have it (or no game). */
export function startTimer(state: GameState, role: Role, spell: SpellId, now: number): GameState {
    const enemy = state.enemies.find((e) => e.role === role);
    if (!enemy?.spells.includes(spell)) return state;
    const cd = cooldown(spell, summonerHaste(state, enemy));
    return { ...state, timers: { ...state.timers, [timerKey(role, spell)]: { end: now + cd * 1000, cd } } };
}

/** Marks the spell as up. */
export function clearTimer(state: GameState, key: string): GameState {
    if (!state.timers[key]) return state;
    const { [key]: _, ...timers } = state.timers;
    return { ...state, timers };
}

/** Takes `ms` off a running timer (it was used that long before you marked it); past zero it's up. */
export function shiftTimer(state: GameState, key: string, ms: number, now: number): GameState {
    if (!running(state, key, now)) return state;
    const t = state.timers[key];
    if (t.end - ms <= now) return clearTimer(state, key);
    return { ...state, timers: { ...state.timers, [key]: { ...t, end: t.end - ms } } };
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

/** "4:12" above a minute, "45" below. */
export const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000);
    return s < 60 ? String(s) : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
