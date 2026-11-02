import { cn } from "cn";
import TimerIcon from "@/components/TimerIcon";
import useDDragonVersion from "@/hooks/useDDragonVersion";
import type { Enemy } from "@/lib/game/types";
import { champIcon } from "@/lib/riot/ddragon";

/** Champion square with a light ring; falls back to the role when the image is missing. */
const Portrait = ({ enemy, className }: { enemy: Enemy; className?: string }) => {
    const v = useDDragonVersion();
    return (
        <TimerIcon
            src={champIcon(v, enemy.id)}
            label={enemy.role.toUpperCase()}
            now={0}
            className={cn("ring-white/25", className)}
        />
    );
};

export default Portrait;
