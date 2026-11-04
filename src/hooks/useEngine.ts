import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { emptyState, startTimer } from "@/lib/game/timers";
import { fetchGame } from "@/lib/riot/liveClient";
import { getGameState, setGameState } from "@/lib/store/gameState";
import type { Settings } from "@/lib/store/settings";

const champs = (s: { enemies: { champ: string }[] }) => s.enemies.map((e) => e.champ).join();

/** Runs in the overlay window only: key events from Rust + live game polling. Returns whether Tab is held. */
const useEngine = ({ shortcut }: Settings) => {
    const [held, setHeld] = useState(false);

    useEffect(() => {
        invoke("configure", { shortcut: shortcut ?? null });
    }, [shortcut]);

    useEffect(() => {
        const unlisten = Promise.all([
            listen<boolean>("hold", (e) => setHeld(e.payload)),
            // The shortcut starts your lane opponent's Flash.
            listen("shortcut", () => {
                const s = getGameState();
                if (s.lane) setGameState(startTimer(s, s.lane, "flash", Date.now()));
            }),
        ]);
        return () => void unlisten.then((fns) => fns.forEach((f) => f()));
    }, []);

    useEffect(() => {
        const poll = async () => {
            try {
                const { enemies, lane } = await fetchGame();
                const s = getGameState(); // re-read: a click may have landed while fetching
                const next = { ...s, live: true, enemies, lane };
                if (champs(next) !== champs(s)) Object.assign(next, { timers: {}, cosmic: [] }); // new game
                if (JSON.stringify(next) !== JSON.stringify(s)) setGameState(next);
            } catch {
                // No game (or it ended): drop enemies and timers.
                if (getGameState().live) setGameState(emptyState());
            }
        };
        poll();
        const id = setInterval(poll, 2000);
        return () => clearInterval(id);
    }, []);

    return held;
};

export default useEngine;
