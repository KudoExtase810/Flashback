import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { applyPhrase, emptyState } from "@/lib/game/timers";
import { fetchGame } from "@/lib/riot/liveClient";
import { getGameState, setGameState } from "@/lib/store/gameState";
import type { Settings } from "@/lib/store/settings";

const champs = (s: { enemies: { champ: string }[] }) => s.enemies.map((e) => e.champ).join();

/** Runs in the overlay window only: keyboard events from Rust + live game polling. Returns whether Tab is held. */
const useEngine = ({ inputMode, shortcut }: Settings) => {
    const [held, setHeld] = useState(false);

    useEffect(() => {
        invoke("configure", { inputMode, shortcut: shortcut ?? null });
    }, [inputMode, shortcut]);

    useEffect(() => {
        const unlisten = Promise.all([
            listen<string>("phrase", (e) => setGameState(applyPhrase(getGameState(), e.payload, Date.now()))),
            listen<boolean>("hold", (e) => setHeld(e.payload)),
            // The shortcut is a callout for your lane opponent's Flash.
            listen("shortcut", () => {
                const s = getGameState();
                if (s.lane) setGameState(applyPhrase(s, `${s.lane} f`, Date.now()));
            }),
        ]);
        return () => void unlisten.then((fns) => fns.forEach((f) => f()));
    }, []);

    useEffect(() => {
        const poll = async () => {
            try {
                const { enemies, lane } = await fetchGame();
                const s = getGameState(); // re-read: a phrase may have landed while fetching
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
