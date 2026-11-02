import GuideSection from "@/components/GuideSection";
import Keycap from "@/components/Keycap";
import { COSMIC_ALIASES, COSMIC_INSIGHT_HASTE, SPELLS } from "@/lib/game/data";
import { cooldown } from "@/lib/game/cooldowns";
import { formatTime } from "@/lib/game/timers";
import type { SpellId } from "@/lib/game/types";
import { COSMIC_INSIGHT_ICON } from "@/lib/riot/ddragon";

const EXAMPLES: SpellId[] = ["flash", "tp", "ignite"];
const ROW = "grid grid-cols-[4.5rem_1fr] items-center gap-x-3 gap-y-2 text-xs";
const NAME = "text-[13px] font-semibold";

/** Callouts tab: what the Cosmic Insight rune changes, what it's worth, and the two ways to mark it. */
const CosmicInsightGuide = () => (
    <GuideSection
        id="cosmic-insight"
        title="Cosmic Insight"
        note="The game doesn't tell Flashback which runes an enemy took, so every enemy starts unmarked. Marking it again removes it, and running timers shorten or lengthen to match."
    >
        <div className="frame flex gap-3 bg-card px-4 py-3">
            <img src={COSMIC_INSIGHT_ICON} alt="" draggable={false} className="size-9 shrink-0" />
            <p className="text-xs leading-relaxed text-muted-foreground">
                A rune that gives <strong className="text-foreground">+{COSMIC_INSIGHT_HASTE} summoner spell haste</strong>. Their
                Flash, Teleport and the rest come back sooner, so mark it if you suspect an enemy has it.
            </p>
        </div>

        <dl className={ROW}>
            <dt className={NAME}>Type</dt>
            <dd className="flex flex-wrap items-center gap-1">
                {[...COSMIC_ALIASES].map((w) => <Keycap key={w}>{w}</Keycap>)}
                <span className="ml-1 text-muted-foreground">e.g.</span> <Keycap>mid ci</Keycap>
            </dd>
            <dt className={NAME}>Click</dt>
            <dd className="text-muted-foreground">The rune icon next to their name in the Game tab.</dd>
        </dl>

        <dl className="grid grid-cols-[4.5rem_auto_auto_1fr] items-center gap-x-3 gap-y-1.5 text-xs tabular-nums">
            {EXAMPLES.map((s) => (
                <div key={s} className="contents">
                    <dt className={NAME}>{SPELLS[s].name}</dt>
                    <dd className="text-muted-foreground">{formatTime(SPELLS[s].cd * 1000)}</dd>
                    <dd className="font-semibold">→ {formatTime(cooldown(s, COSMIC_INSIGHT_HASTE) * 1000)}</dd>
                    <dd />
                </div>
            ))}
        </dl>
    </GuideSection>
);

export default CosmicInsightGuide;
