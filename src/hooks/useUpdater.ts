import { useSyncExternalStore } from "react";
import { getUpdateState, subscribeUpdates } from "@/lib/updater/updater";

/** Where the update check is: shared by the Settings row and the banner on the main page. */
const useUpdater = () => useSyncExternalStore(subscribeUpdates, getUpdateState);

export default useUpdater;
