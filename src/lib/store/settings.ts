import { read, write } from "@/lib/store/storage";

export type Settings = {
    /** How a chat callout is finished: "send" = Enter … Enter, "discard" = Enter … Esc */
    inputMode: "send" | "discard";
    /** "tab": while Tab is held */
    overlayMode: "tab" | "always";
    corner: "top-left" | "top-right" | "middle-left" | "middle-right";
    /** Which summoner spells play public/ding.mp3 when they come back up */
    ding: "all" | "flash" | "off";
    /** Key that starts your lane opponent's Flash: rdev's name for it ("KeyG", "F6", "MouseUnknown(1)"), null = off */
    shortcut: string | null;
};

const DEFAULT_SETTINGS: Settings = {
    inputMode: "discard",
    overlayMode: "tab",
    corner: "top-right",
    ding: "flash",
    shortcut: null,
};
export const getSettings = () => {
    const s = read("settings", () => DEFAULT_SETTINGS);
    if (s.inputMode !== "send" && s.inputMode !== "discard") s.inputMode = "discard"; // older "chat" / "anywhere"
    return s;
};

export const updateSettings = (patch: Partial<Settings>) => write("settings", { ...getSettings(), ...patch });
