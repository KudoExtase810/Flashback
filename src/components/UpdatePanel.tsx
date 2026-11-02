import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { Button } from "@/components/ui/button";
import useUpdater from "@/hooks/useUpdater";
import { checkForUpdate, installUpdate } from "@/lib/updater/updater";

/** Settings: the version you're on and the button to update it. An action, so it sits apart from the setting rows. */
const UpdatePanel = () => {
    const u = useUpdater();
    const [current, setCurrent] = useState("");
    useEffect(() => {
        getVersion().then(setCurrent).catch(() => {});
    }, []);

    const status = {
        idle: "See if a newer version is out.",
        checking: "Looking for a new version…",
        current: "You have the latest version.",
        available: u.status === "available" ? `v${u.version} is ready. Flashback restarts to install it.` : "",
        downloading: u.status === "downloading" ? `Downloading v${u.version}… ${Math.round(u.progress * 100)}%` : "",
        error: "Couldn't check for updates. Are you online?",
    }[u.status];

    return (
        <section className="frame flex items-center justify-between gap-4 bg-card px-3 py-3">
            <div className="flex flex-col gap-1">
                <h2 className="text-[15px] font-semibold">Flashback{current && ` v${current}`}</h2>
                <p className="text-xs text-muted-foreground">{status}</p>
            </div>
            <Button
                disabled={u.status === "checking" || u.status === "downloading"}
                onClick={() => (u.status === "available" ? installUpdate() : checkForUpdate())}
                className="shrink-0 rounded-none bg-foreground font-bold text-background hover:bg-foreground/85"
            >
                {u.status === "available" ? "Update and restart" : u.status === "checking" ? "Checking…" : "Check for updates"}
            </Button>
        </section>
    );
};

export default UpdatePanel;
