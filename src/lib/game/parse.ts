import { COSMIC_ALIASES, ROLE_ALIASES, SPELL_ALIASES } from "./data.ts";
import type { Enemy, Role, SpellId } from "./types.ts";

export type Command =
    | { role: Role; spell: SpellId; clear?: true; late?: number }
    | { role: Role; cosmic: true };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/** A role alias, or a champion-name prefix of 3+ letters ("yas" -> Yasuo's role). */
function resolveTarget(token: string, enemies: Enemy[]): Role | undefined {
    if (ROLE_ALIASES[token]) return ROLE_ALIASES[token];
    if (token.length < 3) return undefined;
    return enemies.find((e) => e.champ && norm(e.champ).startsWith(token))?.role;
}

/**
 * "top f mid tp sup ci" -> one command per target/what pair. Always target -> spell -> optional extra:
 * "yas f 10" = used 10s ago, "yas f clear" = called by mistake, it's up.
 */
export function parse(phrase: string, enemies: Enemy[]): Command[] {
    const tokens = phrase.toLowerCase().split(/\s+/).filter(Boolean);
    const out: Command[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
        const role = resolveTarget(tokens[i], enemies);
        if (!role) continue;
        const next = tokens[i + 1];
        const spell = SPELL_ALIASES[next];
        const extra = tokens[i + 2] ?? "";
        if (spell && extra === "clear") {
            out.push({ role, spell, clear: true });
            i++;
        } else if (spell && /^\d{1,3}$/.test(extra) && Number(extra)) {
            out.push({ role, spell, late: Number(extra) });
            i++;
        } else if (spell) out.push({ role, spell });
        else if (COSMIC_ALIASES.has(next)) out.push({ role, cosmic: true });
        else continue;
        i++;
    }
    return out;
}
