import Portrait from "@/components/Portrait";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import { SPELLS } from "@/lib/game/data";
import { timerKey } from "@/lib/game/timers";
import type { GameState } from "@/lib/game/types";
import { spellIcon } from "@/lib/riot/ddragon";

/** Overlay: portrait + summoner spells per enemy. */
const OverlayList = ({ state, now }: { state: GameState; now: number }) => {
    const v = useDDragonVersion();
    return (
        <ul className="frame flex w-fit flex-col gap-1 bg-glass p-1 shadow-[0_4px_16px_rgb(0_0_0/0.45)]">
            {state.enemies.map((e) => (
                <li key={e.role} className="flex items-center gap-1">
                    <Portrait enemy={e} className="size-7 text-[8px]" />
                    <span className="mx-0.5 h-5 w-px bg-white/15" />
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
