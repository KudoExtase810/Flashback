import { useEffect, useState } from "react";
import { cn } from "cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { shortcutFromButton, shortcutFromCode, shortcutLabel } from "@/lib/input/shortcut";
import { updateSettings } from "@/lib/store/settings";

/** Click, then press any key, middle or side mouse button; Esc cancels. Read here, not by the Rust hook. */
const ShortcutRecorder = ({ value }: { value: string | null }) => {
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        if (!recording) return;
        const done = (name?: string) => {
            if (name) updateSettings({ shortcut: name });
            setRecording(false);
        };
        const onKey = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.code === "Escape") done();
            else if (shortcutFromCode(e.code)) done(shortcutFromCode(e.code));
        };
        // mouseup, not down: preventing it stops the back button from navigating the window.
        const onMouse = (e: MouseEvent) => {
            const name = shortcutFromButton(e.button);
            if (!name) return;
            e.preventDefault();
            done(name);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("mouseup", onMouse);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("mouseup", onMouse);
        };
    }, [recording]);

    return (
        <div className="flex shrink-0 items-center gap-1">
            {/* Disabled while recording so Enter/Space don't click it again. */}
            <Button
                id="shortcut"
                variant="outline"
                disabled={recording}
                onClick={() => setRecording(true)}
                // w-32 + the remove button lines up with the w-40 selects.
                className={cn("rounded-none bg-background disabled:opacity-100", value && !recording ? "w-32" : "w-40")}
            >
                {recording ? "Press a key…" : value ? shortcutLabel(value) : "Set key"}
            </Button>
            {value && !recording && (
                <Button variant="ghost" size="icon-sm" title="Remove shortcut" onClick={() => updateSettings({ shortcut: null })}>
                    <HugeiconsIcon icon={Cancel01Icon} />
                </Button>
            )}
        </div>
    );
};

export default ShortcutRecorder;
