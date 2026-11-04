import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { cn } from "cn";
import OverlayList from "@/components/OverlayList";
import useDing from "@/hooks/useDing";
import useEngine from "@/hooks/useEngine";
import useGameState from "@/hooks/useGameState";
import useNow from "@/hooks/useNow";
import useSettings from "@/hooks/useSettings";
import type { Settings } from "@/lib/store/settings";

const CORNERS: Record<Settings["corner"], string> = {
    "top-left": "top-24 left-4",
    "top-right": "top-24 right-4",
    "middle-left": "top-1/2 left-4 -translate-y-1/2",
    "middle-right": "top-1/2 right-4 -translate-y-1/2",
};

const Overlay = () => {
    const settings = useSettings();
    const held = useEngine(settings);
    const state = useGameState();
    const now = useNow();
    useDing(state.timers, settings.ding);
    const shown = state.live && held;

    // Rust lets clicks through to the game everywhere except over this rect, so keep it current.
    const panel = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = panel.current;
        const send = () => {
            const r = el?.getBoundingClientRect();
            invoke("set_panel_rect", { rect: shown && r ? [r.x, r.y, r.width, r.height] : null });
        };
        send();
        if (!el || !shown) return;
        const observer = new ResizeObserver(send);
        observer.observe(el);
        return () => observer.disconnect();
    }, [shown, settings.corner]);

    return (
        <div className="overlay-root pointer-events-none fixed inset-0">
            <div ref={panel} className={cn("pointer-events-auto absolute", CORNERS[settings.corner])}>
                {shown && <OverlayList state={state} now={now} />}
            </div>
        </div>
    );
};

export default Overlay;
