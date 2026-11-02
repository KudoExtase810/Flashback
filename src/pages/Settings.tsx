import { Link } from "react-router";
import { openUrl } from "@tauri-apps/plugin-opener";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Coffee02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import SettingRow from "@/components/SettingRow";
import SettingSelect from "@/components/SettingSelect";
import ShortcutRecorder from "@/components/ShortcutRecorder";
import UpdatePanel from "@/components/UpdatePanel";
import useSettings from "@/hooks/useSettings";

const KOFI_URL = "https://ko-fi.com/alaa_";

const Settings = () => {
    const s = useSettings();
    return (
        <main className="flex flex-col gap-5 p-4">
            <header className="-mb-3 flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" title="Back" nativeButton={false} render={<Link to="/" />}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} />
                </Button>
                <h1 className="text-lg font-bold tracking-[0.18em]">SETTINGS</h1>
            </header>

            <div className="frame divide-y divide-border bg-card px-3">
                <SettingRow
                    id="inputMode"
                    label="Your callouts"
                    hint={
                        s.inputMode === "send"
                            ? "You close chat with Enter, so your team sees each callout."
                            : "You close chat with Esc, so nothing is sent and only you know."
                    }
                >
                    <SettingSelect
                        name="inputMode"
                        value={s.inputMode}
                        options={{ discard: "Keep private (Esc)", send: "Send to team (Enter)" }}
                    />
                </SettingRow>
                <SettingRow
                    id="shortcut"
                    label="Lane Flash key"
                    hint="Starts your lane opponent's Flash in one press. League still gets the key, so pick one it doesn't use."
                >
                    <ShortcutRecorder value={s.shortcut ?? null} />
                </SettingRow>
                <SettingRow id="overlayMode" label="Overlay" hint="When the enemy panel shows in game.">
                    <SettingSelect name="overlayMode" value={s.overlayMode} options={{ tab: "While holding Tab", always: "Always on" }} />
                </SettingRow>
                <SettingRow id="corner" label="Position" hint="Where the overlay sits on screen.">
                    <SettingSelect
                        name="corner"
                        value={s.corner}
                        options={{ "top-left": "Top left", "top-right": "Top right", "middle-left": "Middle left", "middle-right": "Middle right" }}
                    />
                </SettingRow>
                <SettingRow id="ding" label="Ready sound" hint="Plays a sound when a summoner spell is back up.">
                    <SettingSelect name="ding" value={s.ding} options={{ all: "All spells", flash: "Flash only", off: "Off" }} />
                </SettingRow>
            </div>

            <UpdatePanel />

            <button
                onClick={() => openUrl(KOFI_URL)}
                className="inline-flex h-9 w-fit cursor-pointer items-center gap-2 self-center border border-white/10 px-3 text-xs font-semibold text-muted-foreground outline-none transition-colors hover:border-support/60 hover:text-support focus-visible:ring-2 focus-visible:ring-support/50"
            >
                <HugeiconsIcon icon={Coffee02Icon} className="size-3.5" strokeWidth={2} />
                Support this project
            </button>
        </main>
    );
};

export default Settings;
