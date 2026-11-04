import type { ReactNode } from "react";

type Props = { title: string; note?: ReactNode; id?: string; children: ReactNode };

/** A titled block of the Guide tab, with an optional footnote. `id` lets other tabs scroll to it. */
const GuideSection = ({ title, note, id, children }: Props) => (
    <section id={id} className="flex scroll-mt-4 flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h2>
        {children}
        {note && <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>}
    </section>
);

export default GuideSection;
