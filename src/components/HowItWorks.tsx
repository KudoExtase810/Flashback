import type { ReactNode } from "react";
import Keycap from "@/components/Keycap";

/** The core loop in three steps: click, it times, the overlay shows it. */
const HowItWorks = () => {
    const steps: { title: string; body: ReactNode }[] = [
        {
            title: "Click the spell",
            body: (
                <>
                    An enemy just used Flash? Hold <Keycap>Tab</Keycap> and click their Flash on the overlay. Called it
                    late? Double-click it once for every 5 seconds.
                </>
            ),
        },
        {
            title: "The countdown starts",
            body: (
                <>
                    Flashback uses that champion's actual cooldown, shortened by haste from items they've bought, e.g.
                    Ionian Boots of Lucidity.
                </>
            ),
        },
        {
            title: "Check with Tab",
            body: <>Hold Tab to see which enemy spells are still on cooldown and how long they have left.</>,
        },
    ];

    return (
        <section className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">How it works</h2>
            <ol className="flex flex-col gap-3">
                {steps.map((step, i) => (
                    <li key={i} className="grid grid-cols-[1.5rem_1fr] gap-x-2">
                        <span className="text-lg leading-none font-bold text-flash">{i + 1}</span>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] leading-none font-semibold">{step.title}</h3>
                            <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default HowItWorks;
