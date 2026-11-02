import { cn } from "cn";

type Props<T extends string> = { tabs: Record<T, string>; value: T; onChange: (tab: T) => void };

/** Underlined text tabs. White, not yellow: yellow means "it's up". */
const TabBar = <T extends string,>({ tabs, value, onChange }: Props<T>) => (
    <div role="tablist" className="flex border-b border-border">
        {(Object.keys(tabs) as T[]).map((t) => (
            <button
                key={t}
                role="tab"
                aria-selected={t === value}
                onClick={() => onChange(t)}
                className={cn(
                    "-mb-px cursor-pointer border-b-2 px-3 pt-1 pb-2 text-xs font-bold tracking-wider uppercase outline-none focus-visible:text-foreground",
                    t === value ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
            >
                {tabs[t]}
            </button>
        ))}
    </div>
);

export default TabBar;
