use rdev::{listen, Button, EventType, Key};
use std::sync::{LazyLock, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, WebviewWindow, WindowEvent};

/// rdev name of the lane-Flash shortcut ("KeyG", "MouseUnknown(1)"), if set.
static SHORTCUT: Mutex<Option<String>> = Mutex::new(None);
/// The overlay panel's rect (x, y, width, height in CSS px inside the overlay window) while it's shown.
static PANEL: Mutex<Option<[f64; 4]>> = Mutex::new(None);

#[tauri::command]
fn configure(shortcut: Option<String>) {
    *SHORTCUT.lock().unwrap() = shortcut;
}

#[tauri::command]
fn set_panel_rect(rect: Option<[f64; 4]>) {
    *PANEL.lock().unwrap() = rect;
}

// The game serves this locally with a self-signed cert, which the webview would reject.
static CLIENT: LazyLock<reqwest::Client> = LazyLock::new(|| {
    reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .timeout(Duration::from_millis(800))
        .build()
        .unwrap()
});

#[tauri::command]
async fn live_data() -> Result<String, String> {
    let res = CLIENT
        .get("https://127.0.0.1:2999/liveclientdata/allgamedata")
        .send()
        .await
        .and_then(|r| r.error_for_status())
        .map_err(|e| e.to_string())?;
    res.text().await.map_err(|e| e.to_string())
}

#[cfg(windows)]
fn league_focused() -> bool {
    use windows_sys::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowTextW};
    let mut buf = [0u16; 64];
    let n = unsafe { GetWindowTextW(GetForegroundWindow(), buf.as_mut_ptr(), buf.len() as i32) };
    String::from_utf16_lossy(&buf[..n.max(0) as usize]).starts_with("League of Legends (TM)")
}

#[cfg(not(windows))]
fn league_focused() -> bool {
    true
}

/// Global keyboard and mouse hook. Emits `hold` (Tab held, shows the overlay) and `shortcut` (lane-Flash key
/// pressed). The shortcut is recorded in the webview: rdev attaches to the focused window's input on each key
/// press, which drops keys while our own window has focus.
fn run_hook(app: AppHandle) {
    let mut held = false;

    let result = listen(move |event| {
        let (key, down) = match event.event_type {
            EventType::KeyPress(k) => (Some(k), true),
            EventType::KeyRelease(k) => (Some(k), false),
            // Side and middle buttons can be the shortcut; left/right are for playing.
            EventType::ButtonPress(Button::Left | Button::Right) => return,
            EventType::ButtonPress(_) => (None, true),
            _ => return,
        };
        let name = match (key, event.event_type) {
            (Some(k), _) => format!("{k:?}"),
            (None, EventType::ButtonPress(b)) => format!("Mouse{b:?}"),
            _ => return,
        };

        if key == Some(Key::Tab) && down != held {
            held = down;
            let _ = app.emit("hold", held);
        }
        // Only while League is focused, so the key does nothing in Discord.
        if down && league_focused() && SHORTCUT.lock().unwrap().as_deref() == Some(name.as_str()) {
            let _ = app.emit("shortcut", ());
        }
    });
    if let Err(e) = result {
        eprintln!("keyboard hook failed: {e:?}");
    }
}

/// The overlay lets every click through to the game, except while the cursor is over its panel.
/// ponytail: polls the cursor at ~60 Hz; a low-level mouse hook would be event-driven if this ever matters.
fn track_cursor(overlay: WebviewWindow) {
    let mut over = false;
    loop {
        std::thread::sleep(Duration::from_millis(16));
        let now_over = (|| {
            let [x, y, w, h] = (*PANEL.lock().unwrap())?;
            let cursor = overlay.cursor_position().ok()?;
            let origin = overlay.inner_position().ok()?;
            let scale = overlay.scale_factor().ok()?;
            let cx = (cursor.x - origin.x as f64) / scale;
            let cy = (cursor.y - origin.y as f64) / scale;
            Some(cx >= x && cx < x + w && cy >= y && cy < y + h)
        })()
        .unwrap_or(false);
        if now_over != over {
            over = now_over;
            let _ = overlay.set_ignore_cursor_events(!over);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![configure, set_panel_rect, live_data])
        .setup(|app| {
            let overlay = app.get_webview_window("overlay").unwrap();
            overlay.set_ignore_cursor_events(true)?;
            // Clicking the panel must never take focus from League, or the game stops getting your keys.
            overlay.set_focusable(false)?;
            // Cover the primary monitor; the panel is positioned with CSS.
            if let Some(m) = overlay.primary_monitor()? {
                overlay.set_position(*m.position())?;
                overlay.set_size(*m.size())?;
            }
            let handle = app.handle().clone();
            std::thread::spawn(move || run_hook(handle));
            std::thread::spawn(move || track_cursor(overlay));
            Ok(())
        })
        .on_window_event(|window, event| {
            // The overlay has no close button, so closing settings quits the app.
            if window.label() == "main" && matches!(event, WindowEvent::CloseRequested { .. }) {
                window.app_handle().exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
