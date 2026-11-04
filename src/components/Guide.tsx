import CosmicInsightGuide from "@/components/CosmicInsightGuide";
import { Link } from "react-router";
import GuideSection from "@/components/GuideSection";
import Keycap from "@/components/Keycap";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import useSettings from "@/hooks/useSettings";
import { ROLE_ALIASES, ROLES, SPELL_ALIASES, SPELLS } from "@/lib/game/data";
import { formatTime } from "@/lib/game/timers";
import type { Role, SpellId } from "@/lib/game/types";
import { spellIcon } from "@/lib/riot/ddragon";
import { shortcutLabel } from "@/lib/input/shortcut";

const ROLE_NAMES: Record<Role, string> = { top: "Top", jg: "Jungle", mid: "Mid", adc: "Bot", sup: "Support" };

/** Every word that means `value`, straight from the parser's tables so this list can't drift. */
const wordsFor = <V,>(aliases: Record<string, V>, value: V) => Object.keys(aliases).filter((k) => aliases[k] === value);

const ROW = "grid grid-cols-[4.5rem_1fr] items-center gap-x-3 gap-y-2 text-xs";
const NAME = "text-[13px] font-semibold";

/** The Callouts tab: the who + what pattern, then every word Flashback understands. */
const CalloutGuide = () => {
    const v = useDDragonVersion();
    const settings = useSettings();
    return (
        <div className="flex flex-col gap-5">
            <GuideSection
                title="Who"
                note={
                    <>
                        In a game, the first 3+ letters of a champion's name work too: <Keycap>yas</Keycap>{" "}
                        <Keycap>lee</Keycap> <Keycap>mord</Keycap>.
                    </>
                }
            >
                <dl className={ROW}>
                    {ROLES.map((r) => (
                        <div key={r} className="contents">
                            <dt className={NAME}>{ROLE_NAMES[r]}</dt>
                            <dd className="flex flex-wrap gap-1">
                                {wordsFor(ROLE_ALIASES, r).map((w) => <Keycap key={w}>{w}</Keycap>)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </GuideSection>

            <GuideSection title="Summoner spells" note="Times shown are before haste.">
                <dl className="grid grid-cols-[1.5rem_4.5rem_1fr_auto] items-center gap-x-3 gap-y-2 text-xs">
                    {(Object.keys(SPELLS) as SpellId[]).map((s) => (
                        <div key={s} className="contents">
                            <TimerIcon src={spellIcon(v, SPELLS[s].icon)} label={SPELLS[s].label} now={0} className="size-6" />
                            <dt className={NAME}>{SPELLS[s].name}</dt>
                            <dd className="flex flex-wrap gap-1">
                                {wordsFor(SPELL_ALIASES, s).map((w) => <Keycap key={w}>{w}</Keycap>)}
                            </dd>
                            <dd className="text-muted-foreground tabular-nums">{formatTime(SPELLS[s].cd * 1000)}</dd>
                        </div>
                    ))}
                </dl>
            </GuideSection>

            <CosmicInsightGuide />

            <GuideSection title="Tips">
                <ul className="flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-muted-foreground marker:text-white/20">
                    <li>
                        Several in one message: <Keycap>top f mid tp</Keycap>.
                    </li>
                    <li>
                        {settings.shortcut ? (
                            <>
                                Press <Keycap>{shortcutLabel(settings.shortcut)}</Keycap> to start your lane opponent's Flash
                                without typing.
                            </>
                        ) : (
                            <>
                                Set a Lane Flash key in{" "}
                                <Link to="/settings" className="font-semibold text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white">
                                    Settings
                                </Link>{" "}
                                to start your lane opponent's Flash without typing.
                            </>
                        )}
                    </li>
                    <li>
                        Called it late? Add how many seconds ago: <Keycap>yas f 10</Keycap>.
                    </li>
                    <li>Calling the same thing again restarts its timer.</li>
                    <li>
                        Called it by mistake? Add <Keycap>clear</Keycap> and it's up again: <Keycap>mid f clear</Keycap>.
                    </li>
                </ul>
            </GuideSection>
        </div>
    );
};

export default CalloutGuide;
