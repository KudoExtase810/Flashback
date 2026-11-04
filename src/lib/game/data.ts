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
