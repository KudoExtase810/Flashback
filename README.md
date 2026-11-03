# Flashback

League of Legends summoner spell timers from the callouts you already type in chat. Type `top f`, keep playing, and hold Tab to see when it's back.

## Build and install (Windows)

You need [Node.js](https://nodejs.org), [Rust](https://rustup.rs) and the [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) ("Desktop development with C++"). Windows 11 already includes WebView2.

```bash
npm install
npm run tauri build
```

The first build takes several minutes. The installers end up in `src-tauri/target/release/bundle`:

- `nsis/Flashback_0.1.0_x64-setup.exe`
- `msi/Flashback_0.1.0_x64_en-US.msi`

Run either one to install.

## How it works

1. **Call it in chat.** When an enemy uses Flash, press Enter, type `top f` and press Esc. Nothing is sent. Want your team to see it? Set Settings → "Finish callout with" to **Enter**.2. **Flashback times it.** The timer starts with the spell's real cooldown, counting the enemy's items. Enemies, spells and items come from the game itself, so there is nothing to set up.
3. **Hold Tab to check.** Enemy spells appear on screen. A dim icon with a number is still down. When it comes back, it flashes yellow. Prefer it always visible? Pick "Always on" in Settings.

Before your first game, set League's window mode to **Borderless** or **Windowed**; the overlay can't draw over exclusive fullscreen. Flashback starts tracking by itself when a game loads, Practice Tool included.

### What to type

A target, then what they used:

| Target                      | Examples                     |
| --------------------------- | ---------------------------- |
| Role                        | `top` `jg` `mid` `adc` `sup` |
| Champion (first 3+ letters) | `yas`, `darius`              |

| Used                | Examples                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Summoner spell      | `f` Flash, `tp` Teleport, `ig` Ignite, `h` Heal, `ex` Exhaust, `bar` Barrier, `cl` Cleanse, `gh` Ghost |
| Cosmic Insight rune | `ci` marks it (summoner spells come back faster)                                                       |

Several at once work too: `top f mid tp`.

Called it late? Add how many seconds ago it was used: `yas f 10` starts Flash with 10 seconds already gone. Called it by mistake? Add `clear`: `yas f clear` marks it up again.