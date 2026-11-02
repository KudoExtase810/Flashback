---
version: 1
slug: "src-pages-overlay-tsx"
primary_target: "src/pages/Overlay.tsx"
related_targets: ["src/pages/Home.tsx","src/pages/Settings.tsx"]
---

# Flashback: overlay + main window

Scope: in-game overlay (src/pages/Overlay.tsx), main window (src/pages/Home.tsx), settings (src/pages/Settings.tsx). Mode: Operate.

Audience/job: solo-queue player mid-game; type a callout, glance, know when an enemy summoner or key ability is back. Constraints: overlay tiny and click-through over the game map; main window 420px wide.

## Direction contract

seed: none (direction pinned by user: Blink, replaces Hextech)

THESIS: The app is named after Flash, so it behaves like one: things that come back blink. Refuses the generic dark dashboard with a decorative accent.

OWN-WORLD: Near-black ground #0B0D12, panels #12151C with a hairline white/8 border and a faint yellow light streak on the top edge. Flash yellow #F2E94E is the only accent and only means "up": live status, brand streaks, a returning spell. Cooldown = dimmed, desaturated icon with a white countdown. Barlow Semi Condensed, tabular numerals.

STORY: Waiting screen explains the loop in three steps (call it in chat, Flashback times it, hold Tab). In game: five enemies, portraits, spell icons; anything down is visibly dim with a number.

FIRST VIEWPORT: Wordmark with yellow speed streaks, LIVE/NO GAME badge, then either the waiting card + How it works, or the enemy list + callout box.

SIGNATURE: The blink. When a timer hits zero the icon pops with yellow light and leaves two yellow afterimages trailing off it, then holds a yellow ring for 3s. Reduced motion keeps only the ring.

RISK: Yellow overuse dilutes the signal; keep it off labels and headings.
