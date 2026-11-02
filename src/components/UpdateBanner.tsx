import { Button } from "@/components/ui/button";
import useUpdater from "@/hooks/useUpdater";
import { installUpdate } from "@/lib/updater/updater";

/** Main page: shows only once the launch check found a newer version. */
const UpdateBanner = () => {
    const u = useUpdater();
    if (u.status !== "available" && u.status !== "downloading") return null;
    return (
        <div className="frame flex items-center justify-between gap-3 bg-card px-3 py-2">
            <p className="text-xs">
                <strong className="font-semibold">v{u.version} is out.</strong>{" "}
                <span className="text-muted-foreground">
                    {u.status === "downloading" ? `Downloading… ${Math.round(u.progress * 100)}%` : "Update takes a few seconds."}
                </span>
            </p>
            <Button size="sm" disabled={u.status === "downloading"} onClick={installUpdate} className="shrink-0 rounded-none">
                Update
            </Button>
        </div>
    );
};

export default UpdateBanner;
