import { COSMIC_ALIASES, ROLE_ALIASES, SPELL_ALIASES } from "./data.ts";
import type { Enemy, Role, SpellId } from "./types.ts";

export type Command =
    | { role: Role; spell: SpellId; clear?: true }
    | { role: Role; cosmic: true };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

/** A role alias, or a champion-name prefix of 3+ letters ("yas" -> Yasuo's role). */
function resolveTarget(token: string, enemies: Enemy[]): Role | undefined {
    if (ROLE_ALIASES[token]) return ROLE_ALIASES[token];
    if (token.length < 3) return undefined;
    return enemies.find((e) => e.champ && norm(e.champ).startsWith(token))?.role;
}

/** "top f mid tp sup ci" -> one command per target/what pair; "clear" stops the pair right after it. */
export function parse(phrase: string, enemies: Enemy[]): Command[] {
    const tokens = phrase.toLowerCase().split(/\s+/).filter(Boolean);
    const out: Command[] = [];
    let clear = false;
    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i] === "clear") {
            clear = true;
            continue;
        }
        const role = resolveTarget(tokens[i], enemies);
        if (!role) continue;
        const next = tokens[i + 1];
        const spell = SPELL_ALIASES[next];
        if (spell) out.push(clear ? { role, spell, clear } : { role, spell });
        else if (COSMIC_ALIASES.has(next)) out.push({ role, cosmic: true });
        else continue;
        clear = false;
        i++;
    }
    return out;
}
