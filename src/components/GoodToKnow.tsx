import type { ReactNode } from "react";

const limits = (openCosmic: () => void): ReactNode[] => [
    <>
        <strong>Borderless or Windowed only.</strong> The overlay can't draw over exclusive fullscreen.
    </>,
    <>
        <strong>Cosmic Insight is up to you.</strong> The game only shows enemy keystones, so Flashback can't see this
        rune. Until you mark it, an enemy's summoner timers use their normal cooldown, up to about 45 seconds too long
        for Flash. If you suspect an enemy has it, click the Cosmic Insight icon next to them.{" "}
        <button
            onClick={openCosmic}
            className="cursor-pointer font-semibold text-foreground underline decoration-white/30 underline-offset-4 outline-none hover:decoration-white focus-visible:decoration-white"
        >
            See how it works
        </button>
    </>,
    <>
        <strong>Only flat item haste counts.</strong> Haste from item passives that stack or trigger, and from runes other than Cosmic Insight, is ignored.
    </>,
    <>
        <strong>Running timers don't follow new items.</strong> Haste bought mid-cooldown applies to the next timer.
    </>,
];

/** The limits players should know about, in one place. `openCosmic` jumps to the Cosmic Insight guide. */
const GoodToKnow = ({ openCosmic }: { openCosmic: () => void }) => (
    <section className="flex flex-col gap-2">
        <ul className="flex flex-col gap-2 border-l border-white/10 pl-3 text-xs leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
            {limits(openCosmic).map((item, i) => (
                <li key={i}>{item}</li>
            ))}
        </ul>
    </section>
);

export default GoodToKnow;
