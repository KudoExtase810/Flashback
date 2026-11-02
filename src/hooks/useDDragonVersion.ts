import { useSyncExternalStore } from "react";
import { getVersion, subscribeVersion } from "@/lib/riot/ddragon";

/** Current patch version; re-renders when it arrives so icon URLs resolve. */
const useDDragonVersion = () => useSyncExternalStore(subscribeVersion, getVersion);

export default useDDragonVersion;
