---
name: Flashback
description: Enemy summoner spell timers from chat callouts, in a glanceable in-game overlay.
colors:
  flash: "#f2e94e"
  flash-ink: "#14140a"
  night: "#0b0d12"
  panel: "#12151c"
  popover: "#0e1117"
  secondary: "#191d26"
  muted: "#161a22"
  accent: "#1d222c"
  foreground: "#eef0f4"
  muted-foreground: "#9aa0ac"
  cooldown: "#ffffff"
  destructive: "#ff6b5e"
  border: "rgb(255 255 255 / 0.08)"
  input: "rgb(255 255 255 / 0.14)"
  glass: "rgb(11 13 18 / 0.88)"
typography:
  wordmark:
    fontFamily: "Barlow Semi Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.556
    letterSpacing: "0.18em"
  title:
    fontFamily: "Barlow Semi Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
  body:
    fontFamily: "Barlow Semi Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.625
  label:
    fontFamily: "Barlow Semi Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
  countdown:
    fontFamily: "Barlow Semi Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    fontFeature: "\"tnum\""
rounded:
  none: "0px"
  sm: "2px"
  xl: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
components:
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
  overlay-panel:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.none}"
    padding: "4px"
  button-ghost-icon:
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    size: "28px"
  button-ghost-icon-hover:
    backgroundColor: "{colors.muted}"
  input-callout:
    backgroundColor: "{colors.night}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "4px 10px"
  select-trigger:
    backgroundColor: "{colors.night}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    height: "32px"
    width: "160px"
  kbd-chip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "20px"
  badge-live:
    textColor: "{colors.flash}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  badge-no-game:
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  timer-icon:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.cooldown}"
    typography: "{typography.countdown}"
    rounded: "{rounded.none}"
    size: "36px"
---

# Design System: Flashback

## Overview

**Creative North Star: "Blink"**

The app is named after Flash, so it behaves like one: things that come back blink. The world is a near-black night with hard-edged, almost square panels and a single electric yellow that carries exactly one meaning: it's up. Live status, the brand streaks, and a spell returning are yellow; everything else stays neutral grey-white so that the yellow, when it appears, reads in a fraction of a second over a busy game map.

Density is high and deliberate. The main window is 420px wide and the overlay is a tiny click-through strip of square icons, so every element earns its pixels: tight 4px gaps between icons, condensed type, tabular numerals for every number. Cooldown state is shown by subtraction, not addition: a down icon is dimmed and desaturated with a dark sweep wedge and a plain white countdown, and the reward is the blink when it returns.

**Key Characteristics:**
- Near-black ground, slightly lifted panels, hairline white borders.
- One accent, Flash yellow, used only for "up" (live, brand, returning spell).
- Square geometry: 2px corners at most, many surfaces fully square.
- Barlow Semi Condensed throughout, tabular numerals globally.
- Signature motion: the blink (pop plus two yellow afterimages, then a 3s yellow ring).

## Colors

A cold near-black neutral ramp with one saturated yellow signal.

### Primary
- **Flash Yellow** (`flash`): the only accent. Live badge text, ring and pulse dot; the wordmark speed streaks; the faint top-edge light on every framed panel; the blink pop, afterimages and 3s ring on a returning icon; focus rings and the text caret. Text on a yellow fill uses **Flash Ink** (`flash-ink`).

### Neutral
- **Night** (`night`): app background; also the fill for inputs and select triggers so fields sit recessed inside panels.
- **Panel** (`panel`): framed cards (enemy list, waiting card, settings group).
- **Popover** (`popover`): select dropdowns.
- **Slate Secondary** (`secondary`): timer icon backing behind missing art, kbd chips.
- **Muted / Accent** (`muted`, `accent`): ghost-button hover and list-item focus fills.
- **Frost** (`foreground`): primary text.
- **Ash** (`muted-foreground`): hints, body copy in explanations, section labels, the NO GAME state.
- **Countdown White** (`cooldown`): countdown numerals over dimmed icons, with a heavy dark text shadow for legibility on any icon art.
- **Hairline** (`border`) and **Field Line** (`input`): white at 8% and 14%; panel borders, row dividers, field strokes.
- **Glass** (`glass`): Night at 88%, the overlay panel fill over the game.
- **Ember** (`destructive`): error states only; not used on any shipped surface yet.

### Named Rules
**The It's-Up Rule.** Yellow means "up" and nothing else: live, brand, a spell returning, and the focus ring. Never put it on headings, labels, decorative numbers or selection states; dilution kills the signal.

**The Dim-Not-Paint Rule.** Cooldown is shown by dimming the icon (brightness 75%, grayscale 70%) under a dark conic sweep, with a white countdown. Never tint down-state icons a color.

## Typography

**Display Font:** Barlow Semi Condensed (with ui-sans-serif, system-ui)
**Body Font:** Barlow Semi Condensed
**Label/Mono Font:** same family; numbers use tabular numerals set on `body`.

**Character:** One condensed grotesque at weights 500/600/700 does all the work. It fits countdowns into 28px squares and reads like game UI without importing fantasy ornament.

### Hierarchy
- **Wordmark** (700, 18px, tracking 0.18em, uppercase): the FLASHBACK wordmark and the SETTINGS page title. Page titles only.
- **Title** (600, 15px, line-height 1): champion names, card headings, step titles, setting labels, the callout input text.
- **Body** (500, 12px, line-height 1.625): hints and explanatory copy, in Ash; inline `strong` lifts to Frost at 600.
- **Label** (600, 12px, tracking 0.05em, uppercase, Ash): section headings ("How it works", "Good to know") and the alias reference terms. Badges use the same treatment at 11px bold.
- **Countdown** (700, 13-15px scaled to icon size, tabular): numerals on timer icons; 15px on 36px main-window spells, 13px on 28px overlay icons.

### Named Rules
**The Tabular Rule.** Every number is tabular (set globally on the body). Countdowns must not jitter as they tick.

## Layout

Single column, 16px page padding, 16px gap between blocks (20px on Settings). The main window is a fixed narrow width (about 420px); nothing reflows across breakpoints. Rows are horizontal flex lines: portrait, name and level, then summoner spells on the right. Spacing steps are 4 / 8 / 12 / 16 / 20px; icon strips use 4px gaps, rows use 12px between their parts. The overlay is an absolutely positioned panel at one of four corner presets (top-left, top-right, middle-left, middle-right), 16px from the edge and 96px from the top for the top presets.

## Elevation & Depth

Flat, layered by tone: Night, then Panel, with hairline borders doing the separating. The one structural light is the **frame**: a 1px Hairline border plus an inset 1px top highlight in yellow at 22%, a streak of Flash light along the top edge of every framed panel. The overlay alone carries a soft drop shadow so it separates from the game image beneath.

### Shadow Vocabulary
- **Frame streak** (`box-shadow: inset 0 1px 0 rgb(242 233 78 / 0.22)` with `border: 1px solid rgb(255 255 255 / 0.08)`): every panel: enemy list, waiting card, settings group, select popup, overlay.
- **Overlay lift** (`box-shadow: 0 4px 16px rgb(0 0 0 / 0.45)`): the in-game overlay panel only.
- **Countdown legibility** (`text-shadow: 0 1px 2px rgb(0 0 0 / 0.95)`): countdown numerals only.

### Named Rules
**The One Frame Rule.** Panels get the frame, not a heavier shadow or a colored border. Depth comes from tone and the top-edge streak.

## Shapes

Square. The base radius is 2px and shadcn's sm/md/lg all resolve to it; xl is 4px. Panels, kbd chips, select triggers and popups, badges and timer icons are fully square (0px). Game icons keep a 1px ring (white at 10%, portraits 25%) instead of a border. The recurring small mark is a rotated square (a 6-8px diamond) used as a status dot. The Cosmic Insight toggle is the one circle, because it frames the round rune art.

## Components

### Buttons
Quiet, icon-only, ghost.
- **Shape:** 2px corners, 28px square (`icon-sm`).
- **Ghost:** transparent, Frost icon, Muted fill on hover; 1px press nudge on active.
- **Focus:** yellow ring at 50% via the shared `ring` token.
- The filled primary variant exists in the library (yellow on Flash Ink) but no shipped surface uses it; reserve it for a single "up"-meaning action if ever needed.

### Chips (kbd)
- **Style:** Slate Secondary fill, Frost text, 1px Hairline ring, square, 20px tall, 12px. Used for callout syntax in explanations and the alias reference.

### Cards / Containers
- **Corner Style:** square.
- **Background:** Panel in the main window, Glass in the overlay.
- **Border:** the frame (see Elevation); lists inside divide rows with Hairline dividers.
- **Internal Padding:** 12px x 16px for the waiting card; rows 10px x 8px; overlay 4px.

### Inputs / Fields
- **Style:** Night fill, 1px Field Line stroke, 2px corners; callout input is 36px tall at 15px text. Select triggers are square, 160px wide.
- **Focus:** stroke shifts to yellow with a yellow ring at 50%; caret is yellow.
- **Placeholder:** Ash, written as an example callout.

### Navigation
- A header row: wordmark, status badge, then ghost icon buttons pushed right (clear timers, settings). Settings has a back icon button and the SETTINGS title. No tabs, no nav bar.

### Status Badge
- **LIVE:** yellow 11px bold text, yellow ring at 50%, pulsing yellow diamond (pulse stops under reduced motion).
- **NO GAME:** Ash text, Hairline ring, static Ash diamond.

### Timer Icon (signature)
A square game icon (24px guide icons, 28px overlay, 36px main-window spells) with a 1px ring.
- **Down:** art at brightness 75% and grayscale 70%; a conic sweep wedge of near-black at 78% covers the time left, 30% for the elapsed part; white countdown centered.
- **Coming back (the blink):** a yellow fill flashes in with screen blending at 125% scale and fades to nothing over 450ms; simultaneously two yellow afterimages trail off the left edge (offset 7px and 13px) and fade over 700ms; both ease `cubic-bezier(0.16, 1, 0.3, 1)`. A 2px yellow ring then holds for 3s. Under reduced motion only the ring remains.
- **Interactive (main window):** hover lifts the ring to white 40%; focus shows the yellow ring; click starts or clears the timer.

### Wordmark
FLASHBACK in the wordmark style with three short horizontal yellow streaks (2px tall, 10-20px long, fading from transparent) trailing into its left side, the dash of a Flash.

## Do's and Don'ts

### Do:
- **Do** keep Flash Yellow to "up" meanings: live, brand streaks, the blink, focus.
- **Do** frame every panel with the Hairline border and the yellow top-edge streak.
- **Do** show cooldown by dimming the icon with the dark sweep and a white countdown.
- **Do** use tabular numerals for every number.
- **Do** keep corners square or at 2px.
- **Do** honor reduced motion: blink and pulses collapse to static state (the ring, the dot).

### Don't:
- **Don't** put yellow on headings, section labels, step numbers or selected states.
- **Don't** tint cooldown icons or countdowns a color; the countdown is white.
- **Don't** add rounded cards, heavy shadows or colored borders; the overlay lift is the only drop shadow.
- **Don't** add a second accent color or a light theme; there is one theme.
- **Don't** add a second typeface.
