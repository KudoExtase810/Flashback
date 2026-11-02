import { useEffect } from "react";
import type { Timer } from "@/lib/game/types";
import type { Settings } from "@/lib/store/settings";

const ding = new Audio("/ding.mp3");

/** Overlay window only (one engine, one ding): plays when a summoner timer runs out. */
const useDing = (timers: Record<string, Timer>, mode: Settings["ding"]) => {
    useEffect(() => {
        if (mode === "off") return;
        const now = Date.now();
        const ids = Object.entries(timers)
            .filter(([key, t]) => t.end > now && (mode === "all" || key.endsWith(":flash")))
            .map(([, t]) =>
                setTimeout(() => {
                    ding.currentTime = 0;
                    ding.play().catch(() => {});
                }, t.end - now),
            );
        return () => ids.forEach(clearTimeout);
    }, [timers, mode]);
};

export default useDing;
