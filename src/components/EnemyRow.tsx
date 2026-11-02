import CosmicToggle from "@/components/CosmicToggle";
import Portrait from "@/components/Portrait";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import { cooldown, summonerHaste } from "@/lib/game/cooldowns";
import { SPELLS } from "@/lib/game/data";
import { timerKey } from "@/lib/game/timers";
import type { Enemy, GameState } from "@/lib/game/types";
import { spellIcon } from "@/lib/riot/ddragon";

type Props = {
    enemy: Enemy;
    state: GameState;
    now: number;
    onToggle: (key: string, cd: number) => void;
    onCosmic: () => void;
};

/** Main window row: portrait, name, Cosmic Insight mark, clickable summoner spells. */
const EnemyRow = ({ enemy: e, state, now, onToggle, onCosmic }: Props) => {
    const v = useDDragonVersion();
    return (
        <li className="flex items-center gap-3 px-2.5 py-2">
            <div className="relative">
                <Portrait enemy={e} className="size-10" />
                <span className="absolute inset-x-0 -bottom-1 mx-auto w-fit bg-background px-1 text-[9px] leading-3 font-bold tracking-wider text-foreground uppercase ring-1 ring-white/15">
                    {e.role}
                </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-[15px] leading-none font-semibold">{e.champ}</span>
                    <CosmicToggle on={state.cosmic.includes(e.role)} onClick={onCosmic} />
                </div>
                <span className="text-xs leading-none text-muted-foreground">Level {e.level}</span>
            </div>
            {e.spells.map((s) => {
                const key = timerKey(e.role, s);
                return (
                    <TimerIcon
                        key={s}
                        src={spellIcon(v, SPELLS[s].icon)}
                        label={SPELLS[s].label}
                        timer={state.timers[key]}
                        now={now}
                        className="size-9 text-[15px]"
                        onClick={() => onToggle(key, cooldown(s, summonerHaste(state, e)))}
                    />
                );
            })}
        </li>
    );
};

export default EnemyRow;
