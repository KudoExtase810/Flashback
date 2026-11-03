import Portrait from "@/components/Portrait";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import { SPELLS } from "@/lib/game/data";
import { timerKey } from "@/lib/game/timers";
import type { GameState } from "@/lib/game/types";
import { COSMIC_INSIGHT_ICON, spellIcon } from "@/lib/riot/ddragon";

/**
 * Overlay: portrait + summoner spells per enemy. Between them a hairline divider, or the Cosmic Insight rune
 * for marked enemies. The slot only widens while someone is marked, so the spell columns stay aligned.
 */
const OverlayList = ({ state, now }: { state: GameState; now: number }) => {
    const v = useDDragonVersion();
    const anyCosmic = state.cosmic.length > 0;
    return (
        <ul className="frame flex w-fit flex-col gap-1 bg-glass p-1 shadow-[0_4px_16px_rgb(0_0_0/0.45)]">
            {state.enemies.map((e) => (
                <li key={e.role} className="flex items-center gap-1">
                    <Portrait enemy={e} className="size-7 text-[8px]" />
                    {state.cosmic.includes(e.role) ? (
                        <img src={COSMIC_INSIGHT_ICON} alt="Cosmic Insight" draggable={false} className="size-3.5 shrink-0" />
                    ) : (
                        <span className={anyCosmic ? "flex w-3.5 shrink-0 justify-center" : "mx-0.5"}>
                            <span className="h-5 w-px bg-white/15" />
                        </span>
                    )}
                    {e.spells.map((sp) => (
                        <TimerIcon
                            key={sp}
                            src={spellIcon(v, SPELLS[sp].icon)}
                            label={SPELLS[sp].label}
                            timer={state.timers[timerKey(e.role, sp)]}
                            now={now}
                            className="size-7 text-[13px]"
                        />
                    ))}
                </li>
            ))}
        </ul>
    );
};

export default OverlayList;
