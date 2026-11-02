import { invoke } from "@tauri-apps/api/core";
import { enemiesFromLive, laneFromLive, type LiveData } from "@/lib/game/live";
import type { Enemy, Role } from "@/lib/game/types";
import { itemHaste } from "@/lib/riot/ddragon";

/**
 * Enemies of the running game with item haste, plus your lane opponent's role.
 * Throws when no game is running (the API is only up in game).
 */
export async function fetchGame(): Promise<{ enemies: Enemy[]; lane: Role | null }> {
    // Fetched in Rust: the game serves this with a self-signed cert the webview rejects.
    const data: LiveData = JSON.parse(await invoke<string>("live_data"));
    const enemies = enemiesFromLive(data, await itemHaste());
    if (!enemies.length) throw new Error("no enemies yet");
    return { enemies, lane: laneFromLive(data, enemies) };
}
