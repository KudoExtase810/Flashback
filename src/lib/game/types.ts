export type Role = "top" | "jg" | "mid" | "adc" | "sup";
export type SpellId =
    | "flash" | "tp" | "ignite" | "heal" | "exhaust" | "barrier" | "cleanse" | "ghost" | "smite";

export type Enemy = {
    role: Role;
    champ: string;
    /** Data Dragon champion id ("MonkeyKing" for Wukong) */
    id: string;
    level: number;
    spells: SpellId[];
    /** From items */
    summonerHaste: number;
};

/** end: epoch ms when it's back; cd: total seconds, for the sweep */
export type Timer = { end: number; cd: number };

export type GameState = {
    live: boolean;
    enemies: Enemy[];
    /** `${role}:${spell}` */
    timers: Record<string, Timer>;
    /** Roles marked as running Cosmic Insight; the API doesn't expose minor runes. */
    cosmic: Role[];
    /** Your lane opponent's role, for the Flash shortcut; null when it can't be told. */
    lane: Role | null;
};

/** Summoner haste per item id, from Data Dragon item.json. */
export type ItemHaste = Record<string, number>;
