import { emptyState } from "@/lib/game/timers";
import type { GameState } from "@/lib/game/types";
import { read, write } from "@/lib/store/storage";

export const getGameState = () => read<GameState>("game", emptyState);

/** Skips the write (and the cross-window sync) when nothing changed. */
export function setGameState(next: GameState) {
    if (next !== getGameState()) write("game", next);
}
