import { useState } from "react";
import { cn } from "cn";
import { COSMIC_INSIGHT_ICON } from "@/lib/riot/ddragon";

type Props = { on: boolean; onClick: () => void };

/** Marks an enemy as running Cosmic Insight (+18 summoner haste); the game API can't tell us. */
const CosmicToggle = ({ on, onClick }: Props) => {
    const [broken, setBroken] = useState(false);
    return (
        <button
            onClick={onClick}
            aria-pressed={on}
            title={on ? "Cosmic Insight on (+18 summoner haste). Click to remove." : "Mark Cosmic Insight (+18 summoner haste)"}
            className={cn(
                "grid size-5 shrink-0 cursor-pointer place-items-center rounded-full text-[9px] font-bold outline-none transition-[filter,opacity] focus-visible:ring-2 focus-visible:ring-ring",
                on ? "text-flash ring-1 ring-flash" : "text-muted-foreground opacity-45 grayscale hover:opacity-80",
            )}
        >
            {broken ? "CI" : <img src={COSMIC_INSIGHT_ICON} alt="" draggable={false} onError={() => setBroken(true)} className="size-full" />}
        </button>
    );
};

export default CosmicToggle;
