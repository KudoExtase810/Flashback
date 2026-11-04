import { useState } from "react";
import { cn } from "cn";
import { formatTime } from "@/lib/game/timers";
import type { Timer } from "@/lib/game/types";

type Props = {
    src: string;
    label: string;
    timer?: Timer;
    now: number;
    className?: string;
    /** Gets the click's position in a burst: 1 = click, 2 = double click, ... */
    onClick?: (clicks: number) => void;
};

/**
 * A square game icon. On cooldown: dimmed, with a sweep (dark wedge = time left) and a white countdown.
 * Coming back: it blinks, a bright pop plus yellow afterimages, and pulses with a yellow ring for 5s.
 */
const TimerIcon = ({ src, label, timer, now, className, onClick }: Props) => {
    const [broken, setBroken] = useState(false);
    const left = (timer?.end ?? 0) - now;
    const down = left > 0;
    const justUp = !!timer && !down && -left < 5000;
    const Tag = onClick ? "button" : "span";
    return (
        <Tag
            onClick={onClick && ((e) => onClick(Math.max(1, e.detail)))}
            title={onClick ? (down ? `${label}: click to clear, double-click to take 5s off` : `${label}: click to start`) : label}
            className={cn(
                "relative grid shrink-0 place-items-center overflow-hidden bg-secondary text-[10px] font-semibold text-muted-foreground ring-1 ring-white/10",
                justUp && "animate-blink-trail ring-2 ring-flash",
                onClick && "cursor-pointer outline-none hover:ring-white/40 focus-visible:ring-2 focus-visible:ring-ring",
                className,
            )}
        >
            {label}
            {src && !broken && (
                <img
                    src={src}
                    alt=""
                    draggable={false}
                    onError={() => setBroken(true)}
                    className={cn("absolute inset-0 size-full transition-[filter] duration-300", down && "brightness-75 grayscale-[0.7]")}
                />
            )}
            {down && (
                <>
                    <span
                        className="absolute inset-0"
                        style={{
                            background: `conic-gradient(rgb(5 6 9 / 0.78) ${(left / (timer!.cd * 1000)) * 360}deg, rgb(5 6 9 / 0.3) 0)`,
                        }}
                    />
                    <span
                        className="absolute inset-0 grid place-items-center font-bold text-cooldown"
                        style={{ textShadow: "0 1px 2px rgb(0 0 0 / 0.95)" }}
                    >
                        {formatTime(left)}
                    </span>
                </>
            )}
            {justUp && <span className="animate-ready-pulse pointer-events-none absolute inset-0 bg-flash mix-blend-screen" />}
        </Tag>
    );
};

export default TimerIcon;
