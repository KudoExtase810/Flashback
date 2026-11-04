import { clearTimer, emptyState, shiftTimer, startTimer, timerKey } from "@/lib/game/timers";
import type { GameState, Role, SpellId } from "@/lib/game/types";
import { read, write } from "@/lib/store/storage";

export const getGameState = () => read<GameState>("game", emptyState);

/** Skips the write (and the cross-window sync) when nothing changed. */
export function setGameState(next: GameState) {
    if (next !== getGameState()) write("game", next);
}

/** A double click takes this off a running timer: time that passed before you marked it. */
const WASTED_MS = 5000;
/** How long a click waits for a second click before it counts as a single click. */
const DOUBLE_CLICK_MS = 350;
const pendingClick = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * A click on an enemy spell, in either window. `clicks` is the click's position in a burst (`event.detail`).
 * Click: starts an up spell, clears a running one. Double click: takes 5s off a running timer, nothing else.
 */
export function clickSpell(role: Role, spell: SpellId, clicks: number) {
    const key = timerKey(role, spell);
    clearTimeout(pendingClick.get(key));
    pendingClick.delete(key);
    if (clicks === 2) setGameState(shiftTimer(getGameState(), key, WASTED_MS, Date.now()));
    if (clicks > 1) return; // a triple click and beyond does nothing more
    pendingClick.set(
        key,
        setTimeout(() => {
            pendingClick.delete(key);
            const now = Date.now();
            const s = getGameState();
            setGameState((s.timers[key]?.end ?? 0) > now ? clearTimer(s, key) : startTimer(s, role, spell, now));
        }, DOUBLE_CLICK_MS),
    );
}
