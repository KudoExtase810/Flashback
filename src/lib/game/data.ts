import type { Role, SpellId } from "./types.ts";

export const ROLES: Role[] = ["top", "jg", "mid", "adc", "sup"];

export const COSMIC_INSIGHT_HASTE = 18;

// ponytail: base cooldowns change with patches; edit here. `icon` is the Data Dragon file name.
export const SPELLS: Record<SpellId, { name: string; label: string; cd: number; icon: string }> = {
    flash: { name: "Flash", label: "F", cd: 300, icon: "SummonerFlash" },
    tp: { name: "Teleport", label: "TP", cd: 360, icon: "SummonerTeleport" },
    ignite: { name: "Ignite", label: "IG", cd: 180, icon: "SummonerDot" },
    heal: { name: "Heal", label: "H", cd: 240, icon: "SummonerHeal" },
    exhaust: { name: "Exhaust", label: "EX", cd: 240, icon: "SummonerExhaust" },
    barrier: { name: "Barrier", label: "BAR", cd: 180, icon: "SummonerBarrier" },
    cleanse: { name: "Cleanse", label: "CL", cd: 240, icon: "SummonerBoost" },
    ghost: { name: "Ghost", label: "GH", cd: 240, icon: "SummonerHaste" },
    smite: { name: "Smite", label: "SM", cd: 90, icon: "SummonerSmite" },
};

export const ROLE_ALIASES: Record<string, Role> = {
    top: "top",
    jg: "jg", jgl: "jg", jung: "jg", jungle: "jg",
    mid: "mid",
    adc: "adc", ad: "adc", bot: "adc",
    sup: "sup", supp: "sup", support: "sup",
};

export const SPELL_ALIASES: Record<string, SpellId> = {
    f: "flash", fl: "flash", flash: "flash",
    tp: "tp", tele: "tp", teleport: "tp",
    i: "ignite", ig: "ignite", ign: "ignite", ignite: "ignite",
    h: "heal", heal: "heal",
    ex: "exhaust", exh: "exhaust", exhaust: "exhaust",
    b: "barrier", bar: "barrier", barrier: "barrier",
    c: "cleanse", cl: "cleanse", cle: "cleanse", cleanse: "cleanse",
    g: "ghost", gh: "ghost", ghost: "ghost",
    sm: "smite", smite: "smite",
};

export const COSMIC_ALIASES = new Set(["ci", "cosmic"]);
