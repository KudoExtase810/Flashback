import type { ItemHaste } from "./types.ts";

/**
 * Reads summoner haste out of Data Dragon item.json descriptions: "Gain 10 Summoner Spell Haste".
 * ponytail: conditional/stacking passives aren't counted.
 */
export function itemHasteFromDDragon(json: { data: Record<string, { description: string }> }): ItemHaste {
    const out: ItemHaste = {};
    for (const [id, item] of Object.entries(json.data)) {
        const haste = +(/Gain (\d+) Summoner Spell Haste/.exec(item.description)?.[1] ?? 0);
        if (haste) out[id] = haste;
    }
    return out;
}

/** Total summoner haste of everything a player holds. */
export const sumHaste = (items: { itemID: number }[], itemHaste: ItemHaste) =>
    items.reduce((h, i) => h + (itemHaste[i.itemID] ?? 0), 0);
