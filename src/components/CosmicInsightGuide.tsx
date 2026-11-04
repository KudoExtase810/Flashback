import GuideSection from "@/components/GuideSection";
import { COSMIC_INSIGHT_HASTE, SPELLS } from "@/lib/game/data";
import { cooldown } from "@/lib/game/cooldowns";
import { formatTime } from "@/lib/game/timers";
import type { SpellId } from "@/lib/game/types";
import { COSMIC_INSIGHT_ICON } from "@/lib/riot/ddragon";

const EXAMPLES: SpellId[] = ["flash", "tp", "ignite"];
const NAME = "text-[13px] font-semibold";

/** Guide tab: what Cosmic Insight changes, what it's worth, and how to mark it. */
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

        <p className="text-xs text-muted-foreground">
            Suspect an enemy took it? Click the Cosmic Insight icon next to their portrait, on the overlay or in the Game tab.
        </p>

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
