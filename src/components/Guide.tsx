import { Link } from "react-router";
import CosmicInsightGuide from "@/components/CosmicInsightGuide";
import GuideSection from "@/components/GuideSection";
import Keycap from "@/components/Keycap";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import useSettings from "@/hooks/useSettings";
import { SPELLS } from "@/lib/game/data";
import { formatTime } from "@/lib/game/timers";
import type { SpellId } from "@/lib/game/types";
import { spellIcon } from "@/lib/riot/ddragon";
import { shortcutLabel } from "@/lib/input/shortcut";

const ROW = "grid grid-cols-[6rem_1fr] items-baseline gap-x-3 gap-y-2 text-xs";
const NAME = "text-[13px] font-semibold";

/** The Guide tab: what each click does, the base cooldowns, and Cosmic Insight. */
const Guide = () => {
    const v = useDDragonVersion();
    const settings = useSettings();
    return (
        <div className="flex flex-col gap-5">
            <GuideSection
                title="Clicks"
                note="In game, hold Tab to show the overlay, then click it. Clicks anywhere else still go to the game."
            >
                <dl className={ROW}>
                    <dt className={NAME}>Click a spell</dt>
                    <dd className="text-muted-foreground">Starts its timer. Click again while it runs to clear it.</dd>
                    <dt className={NAME}>Double-click</dt>
                    <dd className="text-muted-foreground">
                        Takes 5s off a running timer. Called it 20s late? Double-click it four times.
                    </dd>
                    <dt className={NAME}>Cosmic Insight</dt>
                    <dd className="text-muted-foreground">
                        Click the Cosmic Insight icon next to an enemy when you suspect they took it.
                    </dd>
                    <dt className={NAME}>Lane Flash key</dt>
                    <dd className="text-muted-foreground">
                        {settings.shortcut ? (
                            <>
                                <Keycap>{shortcutLabel(settings.shortcut)}</Keycap> starts your lane opponent's Flash.
                            </>
                        ) : (
                            <>
                                Starts your lane opponent's Flash. Set one in{" "}
                                <Link to="/settings" className="font-semibold text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">
                                    Settings
                                </Link>
                                .
                            </>
                        )}
                    </dd>
                </dl>
            </GuideSection>

            <GuideSection title="Summoner spells" note="Times shown are before haste.">
                <dl className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-x-3 gap-y-2 text-xs">
                    {(Object.keys(SPELLS) as SpellId[]).map((s) => (
                        <div key={s} className="contents">
                            <TimerIcon src={spellIcon(v, SPELLS[s].icon)} label={SPELLS[s].label} now={0} className="size-6" />
                            <dt className={NAME}>{SPELLS[s].name}</dt>
                            <dd className="text-muted-foreground tabular-nums">{formatTime(SPELLS[s].cd * 1000)}</dd>
                        </div>
                    ))}
                </dl>
            </GuideSection>

            <CosmicInsightGuide />
        </div>
    );
};

export default Guide;
