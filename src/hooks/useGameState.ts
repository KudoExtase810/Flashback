import { useSyncExternalStore } from "react";
import { getGameState } from "@/lib/store/gameState";
import { subscribe } from "@/lib/store/storage";

/** Enemies, timers and Cosmic Insight marks, kept in sync across both windows. */
const useGameState = () => useSyncExternalStore(subscribe, getGameState);

export default useGameState;
