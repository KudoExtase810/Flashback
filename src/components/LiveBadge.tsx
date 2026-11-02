import { cn } from "cn";

/** LIVE when the game's local API answers, NO GAME otherwise. */
const LiveBadge = ({ live }: { live: boolean }) => (
    <span
        className={cn(
            "flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] font-bold tracking-wider ring-1",
            live ? "text-flash ring-flash/50" : "text-muted-foreground ring-border",
        )}
    >
        <span className={cn("size-1.5 rotate-45", live ? "animate-pulse bg-flash motion-reduce:animate-none" : "bg-muted-foreground")} />
        {live ? "LIVE" : "NO GAME"}
    </span>
);

export default LiveBadge;
