import { useEffect, useState } from "react";
import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, Settings01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import CalloutGuide from "@/components/CalloutGuide";
import CalloutInput from "@/components/CalloutInput";
import EnemyList from "@/components/EnemyList";
import GoodToKnow from "@/components/GoodToKnow";
import HowItWorks from "@/components/HowItWorks";
import LiveBadge from "@/components/LiveBadge";
import TabBar from "@/components/TabBar";
import UpdateBanner from "@/components/UpdateBanner";
import WaitingForGame from "@/components/WaitingForGame";
import useGameState from "@/hooks/useGameState";
import useNow from "@/hooks/useNow";
import { getGameState, setGameState } from "@/lib/store/gameState";
import { checkForUpdate, getUpdateState } from "@/lib/updater/updater";

const TABS = { game: "Game", callouts: "Callouts", limits: "Limits" };

const Home = () => {
    const state = useGameState();
    const now = useNow();
    const [tab, setTab] = useState<keyof typeof TABS>("game");

    // Once per launch. Home remounts when you come back from Settings, so skip if a check already ran.
    useEffect(() => {
        if (getUpdateState().status === "idle") checkForUpdate(true);
    }, []);

    return (
        <main className="flex min-h-dvh flex-col gap-4 p-4">
            <header className="flex items-center gap-3">
                <LiveBadge live={state.live} />
                <div className="ml-auto flex gap-1">
                    {state.live && (
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Clear all timers"
                            onClick={() => setGameState({ ...getGameState(), timers: {} })}
                        >
                            <HugeiconsIcon icon={RefreshIcon} />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" title="Settings" nativeButton={false} render={<Link to="/settings" />}>
                        <HugeiconsIcon icon={Settings01Icon} />
                    </Button>
                </div>
            </header>

            <UpdateBanner />

            <TabBar tabs={TABS} value={tab} onChange={setTab} />

            {tab === "game" &&
                (state.live ? (
                    <>
                        <EnemyList state={state} now={now} />
                        <CalloutInput />
                        <p className="-mt-2 text-xs text-muted-foreground">
                            Click an icon to start or clear its timer, the rune to mark Cosmic Insight.
                        </p>
                    </>
                ) : (
                    <>
                        <WaitingForGame />
                        <HowItWorks />
                        <button
                            onClick={() => setTab("callouts")}
                            className="w-fit cursor-pointer text-xs font-semibold text-foreground underline decoration-white/30 underline-offset-4 outline-none hover:decoration-white focus-visible:decoration-white"
                        >
                            See every word you can type
                        </button>
                    </>
                ))}
            {tab === "callouts" && <CalloutGuide />}
            {tab === "limits" && (
                <GoodToKnow
                    openCosmic={() => {
                        setTab("callouts");
                        // The Callouts tab isn't rendered until the state change commits.
                        requestAnimationFrame(() => document.getElementById("cosmic-insight")?.scrollIntoView());
                    }}
                />
            )}
        </main>
    );
};

export default Home;
