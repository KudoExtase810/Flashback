import { read, write } from "@/lib/store/storage";

export type Settings = {
    corner: "top-left" | "top-right" | "middle-left" | "middle-right";
    /** Which summoner spells play public/ding.mp3 when they come back up */
    ding: "all" | "flash" | "off";
    /** Key that starts your lane opponent's Flash: rdev's name for it ("KeyG", "F6", "MouseUnknown(1)"), null = off */
    shortcut: string | null;
};

const DEFAULT_SETTINGS: Settings = {
    corner: "top-right",
    ding: "flash",
    shortcut: null,
};
export const getSettings = () => read("settings", () => DEFAULT_SETTINGS);

export const updateSettings = (patch: Partial<Settings>) => write("settings", { ...getSettings(), ...patch });
