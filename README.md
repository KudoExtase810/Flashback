# Flashback

League of Legends summoner spell timers in an in-game overlay. Hold Tab, click the enemy's Flash, and see when it's back.

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

1. **Click the spell.** When an enemy uses Flash, hold Tab and click their Flash on the overlay. Called it late? Double-click the running timer once for every 5 seconds. Clicked by mistake? Click it again to clear it.
2. **Flashback times it.** The timer starts with the spell's real cooldown, counting the enemy's items. Enemies, spells and items come from the game itself, so there is nothing to set up.
3. **Hold Tab to check.** A dim icon with a number is still down. When it comes back, it flashes yellow.

The overlay only takes clicks over its own panel; everywhere else they go to the game, and clicking it never takes focus from League. Suspect an enemy took Cosmic Insight? Click the Cosmic Insight icon next to their portrait (their summoner spells come back faster). Want Flash in one press? Set a Lane Flash key in Settings to start your lane opponent's Flash.

Before your first game, set League's window mode to **Borderless** or **Windowed**; the overlay can't draw over exclusive fullscreen. Flashback starts tracking by itself when a game loads, Practice Tool included.
