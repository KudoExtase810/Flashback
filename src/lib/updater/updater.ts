import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type UpdateState =
    | { status: "idle" }
    | { status: "checking" }
    | { status: "current" }
    | { status: "available"; version: string }
    | { status: "downloading"; version: string; progress: number }
    | { status: "error" };

let state: UpdateState = { status: "idle" };
let found: Update | null = null;
const listeners = new Set<() => void>();

const set = (next: UpdateState) => {
    state = next;
    listeners.forEach((l) => l());
};

export const getUpdateState = () => state;
export const subscribeUpdates = (l: () => void) => {
    listeners.add(l);
    return () => void listeners.delete(l);
};

/** Asks the update server for a newer version. `quiet`: a failed launch check shows nothing instead of an error. */
export async function checkForUpdate(quiet = false) {
    if (state.status === "checking" || state.status === "downloading") return;
    set({ status: "checking" });
    try {
        found = await check();
        set(found ? { status: "available", version: found.version } : { status: "current" });
    } catch {
        set(quiet ? { status: "idle" } : { status: "error" });
    }
}

/** Downloads and installs the version `checkForUpdate` found, then restarts into it. */
export async function installUpdate() {
    if (!found || state.status !== "available") return;
    const version = state.version;
    let total = 0;
    let done = 0;
    try {
        await found.downloadAndInstall((e) => {
            if (e.event === "Started") total = e.data.contentLength ?? 0;
            if (e.event === "Progress") done += e.data.chunkLength;
            set({ status: "downloading", version, progress: total ? Math.min(done / total, 1) : 0 });
        });
        await relaunch(); // on Windows the installer usually restarts the app itself first
    } catch {
        set({ status: "error" });
    }
}
