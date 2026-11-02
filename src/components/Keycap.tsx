import type { ReactNode } from "react";
import { Kbd } from "@/components/ui/kbd";

/** Something the player types or presses: a word, a key. */
const Keycap = ({ children }: { children: ReactNode }) => (
    <Kbd className="rounded-none bg-secondary text-foreground ring-1 ring-border">{children}</Kbd>
);

export default Keycap;
