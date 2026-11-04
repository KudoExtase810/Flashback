# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo-queue League of Legends players of any rank who want to track enemy summoner spells without alt-tabbing or paying for a companion app. They use it mid-game, under time pressure, with eyes mostly on the game.

## Product Purpose

Flashback tracks enemy summoner-spell cooldowns from a click on a glanceable in-game overlay. Success: a player clicks once, keeps playing, and knows at a glance when an enemy's Flash is back.

## Positioning

One click instead of typing in chat or counting in your head; Flashback shows it on a glanceable overlay. No account, no ads, nothing automatic that Riot disallows: every timer starts from the player's own input.

## Operating Context

- Windows desktop app (Tauri) running beside League of Legends in Borderless or Windowed mode.
- Two surfaces: a transparent, always-on-top overlay over the game that takes clicks only over its panel and never takes focus, and a small main window (enemy list, guide, settings).
- Enemy champions, summoner spells, levels and items come from Riot's local Live Client Data API (127.0.0.1:2999). Outside a game there is nothing to track: no overlay, the main window waits for a game.
- Icons and item haste come from Riot's Data Dragon CDN.

## Capabilities and Constraints

- Click a spell to start or clear its timer; double-click a running timer to take 5s off (repeat for more). Lane Flash key starts the lane opponent's Flash.
- Overlay shows while Tab is held; corner presets.
- Summoner haste comes from enemy items (parsed from Data Dragon). Cosmic Insight is marked by the player (Cosmic Insight icon), since the API only exposes keystones.
- Summoner cooldowns are patch-dependent constants.

## Evidence on Hand

No testimonials, user counts, or press. Do not fabricate any.

## Product Principles

1. Glanceable over complete: the overlay must be readable, and clickable, in a fraction of a second.
2. The player's input is the trigger; never automate what Riot disallows.
3. Zero setup per game.
4. Compact: every element on the overlay earns its pixels.
