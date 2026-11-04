import EnemyRow from "@/components/EnemyRow";
import type { GameState } from "@/lib/game/types";

/** Main window: every enemy in one panel. */
const EnemyList = ({ state, now }: { state: GameState; now: number }) => (
    <ul className="frame divide-y divide-border bg-card">
        {state.enemies.map((e) => (
            <EnemyRow key={e.role} enemy={e} state={state} now={now} />
        ))}
    </ul>
);

export default EnemyList;
