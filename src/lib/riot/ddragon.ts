import { itemHasteFromDDragon } from "@/lib/game/items";
import type { ItemHaste } from "@/lib/game/types";

// Riot's static data CDN: free, no key. Champion/spell icons and item haste for the current patch.
const CDN = "https://ddragon.leagueoflegends.com";
const VERSION = "flashback:dd-version";

let version = localStorage.getItem(VERSION) ?? "";
const listeners = new Set<() => void>();

fetch(`${CDN}/api/versions.json`)
    .then((r) => r.json())
    .then((v: string[]) => {
        if (v[0] === version) return;
        version = v[0];
        localStorage.setItem(VERSION, version);
        listeners.forEach((l) => l());
    })
    .catch(() => {}); // offline: keep the cached version, icons fall back to labels

/** Current patch version ("" until known); subscribe to hear when it arrives. */
export const getVersion = () => version;
export const subscribeVersion = (l: () => void) => {
    listeners.add(l);
    return () => void listeners.delete(l);
};

export const spellIcon = (v: string, file: string) => v && `${CDN}/cdn/${v}/img/spell/${file}.png`;
export const champIcon = (v: string, id: string) => v && id && `${CDN}/cdn/${v}/img/champion/${id}.png`;

export const COSMIC_INSIGHT_ICON = `${CDN}/cdn/img/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png`;

let items: Promise<ItemHaste> | undefined;

/** Summoner haste per item id for the current patch, fetched once. */
export function itemHaste(): Promise<ItemHaste> {
    if (!version) return Promise.resolve({});
    items ??= fetch(`${CDN}/cdn/${version}/data/en_US/item.json`)
        .then((r) => r.json())
        .then(itemHasteFromDDragon)
        .catch(() => {
            items = undefined; // retry on the next poll
            return {};
        });
    return items;
}
