import { useState } from "react";
import { Input } from "@/components/ui/input";
import { applyPhrase } from "@/lib/game/timers";
import { getGameState, setGameState } from "@/lib/store/gameState";

/** Type a callout here to test it without the game. */
const CalloutInput = () => {
    const [phrase, setPhrase] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setGameState(applyPhrase(getGameState(), phrase, Date.now()));
                setPhrase("");
            }}
        >
            <Input
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Test a callout: top f, mid tp, yas ig 10"
                aria-label="Test a callout"
                className="h-9 bg-background text-[15px]"
            />
        </form>
    );
};

export default CalloutInput;
