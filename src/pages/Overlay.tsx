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

    return (
        <div className="overlay-root pointer-events-none fixed inset-0">
            <div className={cn("absolute", CORNERS[settings.corner])}>
                {state.live && (held || settings.overlayMode === "always") && <OverlayList state={state} now={now} />}
            </div>
        </div>
    );
};

export default Overlay;
