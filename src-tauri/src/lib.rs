use rdev::{listen, Button, EventType, Key};
use std::sync::{LazyLock, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, WindowEvent};

/// How a callout typed in chat is finished.
#[derive(Clone, Copy, PartialEq)]
enum InputMode {
    /// Enter … Enter: the message is sent, so your team sees the callout too.
    Send,
    /// Enter … Esc: the message is thrown away; only Flashback reads it.
    Discard,
}

static MODE: Mutex<InputMode> = Mutex::new(InputMode::Send);
/// rdev name of the lane-Flash shortcut ("KeyG", "MouseUnknown(1)"), if set.
static SHORTCUT: Mutex<Option<String>> = Mutex::new(None);

#[tauri::command]
fn configure(input_mode: String, shortcut: Option<String>) {
    *MODE.lock().unwrap() = if input_mode == "discard" { InputMode::Discard } else { InputMode::Send };
    *SHORTCUT.lock().unwrap() = shortcut;
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

// Map by virtual key rather than rdev's `name`: on Windows that calls ToUnicode,
// which eats dead keys (accents) in other apps. Letter VKs already follow the layout.
fn key_char(key: Key) -> Option<char> {
    use Key::*;
    let c = match key {
        KeyA => 'a', KeyB => 'b', KeyC => 'c', KeyD => 'd', KeyE => 'e', KeyF => 'f',
        KeyG => 'g', KeyH => 'h', KeyI => 'i', KeyJ => 'j', KeyK => 'k', KeyL => 'l',
        KeyM => 'm', KeyN => 'n', KeyO => 'o', KeyP => 'p', KeyQ => 'q', KeyR => 'r',
        KeyS => 's', KeyT => 't', KeyU => 'u', KeyV => 'v', KeyW => 'w', KeyX => 'x',
        KeyY => 'y', KeyZ => 'z', Space => ' ',
        _ => return None,
    };
    Some(c)
}

/// Global keyboard and mouse hook. Emits `phrase` (typed text to parse), `hold` (Tab held, shows the overlay) and
/// `shortcut` (lane-Flash key pressed). The shortcut is recorded in the webview: rdev attaches to the focused
/// window's input on each key press, which drops keys while our own window has focus.
fn run_hook(app: AppHandle) {
    let mut buf = String::new();
    // ponytail: chat open/closed is inferred from Enter/Esc, so it can desync if chat is
    // closed another way; the next Esc resets it.
    let mut chat_open = false;
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
        if !down {
            return;
        }
        // Only listen while League is focused, so chatting in Discord never starts timers.
        if !league_focused() {
            buf.clear();
            chat_open = false;
            return;
        }
        if !chat_open && SHORTCUT.lock().unwrap().as_deref() == Some(name.as_str()) {
            let _ = app.emit("shortcut", ());
        }
        let Some(key) = key else { return };

        // The key that closes chat decides whether we read it: Enter (sent) or Esc (discarded).
        let closing = match key {
            Key::Return | Key::KpReturn => Some(InputMode::Send),
            Key::Escape => Some(InputMode::Discard),
            _ => None,
        };
        match closing {
            Some(how) => {
                if chat_open && how == *MODE.lock().unwrap() && !buf.trim().is_empty() {
                    let _ = app.emit("phrase", buf.clone());
                }
                buf.clear();
                // Enter opens chat when it's closed; Esc only ever closes it.
                chat_open = !chat_open && how == InputMode::Send;
            }
            None if key == Key::Backspace => {
                buf.pop();
            }
            None if chat_open => buf.extend(key_char(key)),
            None => {}
        }
    });
    if let Err(e) = result {
        eprintln!("keyboard hook failed: {e:?}");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![configure, live_data])
        .setup(|app| {
            let overlay = app.get_webview_window("overlay").unwrap();
            overlay.set_ignore_cursor_events(true)?;
            // Cover the primary monitor; the panel is positioned with CSS.
            if let Some(m) = overlay.primary_monitor()? {
                overlay.set_position(*m.position())?;
                overlay.set_size(*m.size())?;
            }
            let handle = app.handle().clone();
            std::thread::spawn(move || run_hook(handle));
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
