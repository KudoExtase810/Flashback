// Both windows share one origin, so localStorage is the shared store and the
// `storage` event keeps the other window in sync.

const PREFIX = "flashback:";

const cache = new Map<string, unknown>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

window.addEventListener("storage", (e) => {
    if (e.key?.startsWith(PREFIX)) {
        cache.delete(e.key);
        notify();
    }
});

/** Cached read; stored fields are merged over the fallback so new fields get defaults. */
export function read<T>(key: string, fallback: () => T): T {
    const k = PREFIX + key;
    if (!cache.has(k)) {
        const raw = localStorage.getItem(k);
        cache.set(k, raw ? { ...fallback(), ...JSON.parse(raw) } : fallback());
    }
    return cache.get(k) as T;
}

export function write<T>(key: string, value: T) {
    const k = PREFIX + key;
    cache.set(k, value);
    localStorage.setItem(k, JSON.stringify(value));
    notify();
}

export const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => void listeners.delete(l);
};
