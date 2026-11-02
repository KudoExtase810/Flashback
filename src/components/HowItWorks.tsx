import type { ReactNode } from "react";
import Keycap from "@/components/Keycap";
import useSettings from "@/hooks/useSettings";

/** The core loop in three steps: type, it times, the overlay shows it. Follows the current settings. */
const HowItWorks = () => {
    const s = useSettings();
    const steps: { title: string; body: ReactNode }[] = [
        {
            title: "Call out the spell",
            body: (
                <>
                    An enemy just used Flash? Open chat with <Keycap>Enter</Keycap>, type <Keycap>top f</Keycap>, then press{" "}
                    {s.inputMode === "send" ? (
                        <>
                            <Keycap>Enter</Keycap>. Your team sees it too.
                        </>
                    ) : (
                        <>
                            <Keycap>Esc</Keycap>. Nothing is sent, so it stays between you and Flashback.
                        </>
                    )}
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
            title: s.overlayMode === "tab" ? "Check with Tab" : "Check the overlay",
            body: (
                <>
                    {s.overlayMode === "tab" ? "Hold Tab" : "Look at the overlay"} to see which enemy spells are still on
                    cooldown and how long they have left.
                </>
            ),
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
