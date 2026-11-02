import { useSyncExternalStore } from "react";
import { getSettings } from "@/lib/store/settings";
import { subscribe } from "@/lib/store/storage";

/** Settings, kept in sync across both windows. */
const useSettings = () => useSyncExternalStore(subscribe, getSettings);

export default useSettings;
