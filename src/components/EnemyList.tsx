import EnemyRow from "@/components/EnemyRow";
import { toggleCosmic, toggleTimer } from "@/lib/game/timers";
import type { GameState } from "@/lib/game/types";
import { getGameState, setGameState } from "@/lib/store/gameState";

/** Main window: every enemy in one panel. */
const EnemyList = ({ state, now }: { state: GameState; now: number }) => (
    <ul className="frame divide-y divide-border bg-card">
        {state.enemies.map((e) => (
            <EnemyRow
                key={e.role}
                enemy={e}
                state={state}
                now={now}
                onToggle={(key, cd) => setGameState(toggleTimer(getGameState(), key, cd, Date.now()))}
                onCosmic={() => setGameState(toggleCosmic(getGameState(), e.role, Date.now()))}
            />
        ))}
    </ul>
);

export default EnemyList;
