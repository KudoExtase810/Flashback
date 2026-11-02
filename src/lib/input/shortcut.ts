// The shortcut is stored as rdev's name for the key (what the Rust hook compares against in game),
// but recorded in the webview: rdev drops key presses while our own window is focused.

const CODES: Record<string, string> = {
    Backquote: "BackQuote", Minus: "Minus", Equal: "Equal", BracketLeft: "LeftBracket", BracketRight: "RightBracket",
    Semicolon: "SemiColon", Quote: "Quote", Backslash: "BackSlash", IntlBackslash: "IntlBackslash",
    Comma: "Comma", Period: "Dot", Slash: "Slash", Space: "Space", Tab: "Tab", Enter: "Return", NumpadEnter: "Return",
    Backspace: "Backspace", CapsLock: "CapsLock", ShiftLeft: "ShiftLeft", ShiftRight: "ShiftRight",
    ControlLeft: "ControlLeft", ControlRight: "ControlRight", AltLeft: "Alt", AltRight: "AltGr",
    MetaLeft: "MetaLeft", MetaRight: "MetaRight", Insert: "Insert", Delete: "Delete", Home: "Home", End: "End",
    PageUp: "PageUp", PageDown: "PageDown", ArrowUp: "UpArrow", ArrowDown: "DownArrow", ArrowLeft: "LeftArrow",
    ArrowRight: "RightArrow", NumpadAdd: "KpPlus", NumpadSubtract: "KpMinus", NumpadMultiply: "KpMultiply",
    NumpadDivide: "KpDivide", NumpadDecimal: "KpDelete", ScrollLock: "ScrollLock", Pause: "Pause", NumLock: "NumLock",
};

/** KeyboardEvent.code -> rdev key name ("KeyG", "Num5", "Kp0", "F7"); undefined if rdev can't tell it apart. */
export function shortcutFromCode(code: string): string | undefined {
    if (/^Key[A-Z]$/.test(code) || /^F([1-9]|1[0-2])$/.test(code)) return code;
    const f = /^F(1[3-9]|2[0-4])$/.exec(code);
    if (f) return `Unknown(${124 + +f[1] - 13})`; // rdev has no F13+, they come through as the virtual-key code
    const digit = /^(Digit|Numpad)(\d)$/.exec(code);
    if (digit) return `${digit[1] === "Digit" ? "Num" : "Kp"}${digit[2]}`;
    return CODES[code];
}

/** MouseEvent.button -> rdev name. Left and right click are for playing. */
export const shortcutFromButton = (button: number) =>
    ({ 1: "MouseMiddle", 3: "MouseUnknown(1)", 4: "MouseUnknown(2)" })[button];

/** "KeyG" -> "G", "Kp0" -> "Numpad 0", "MouseUnknown(1)" -> "Mouse 4" (the back side button). */
export const shortcutLabel = (name: string) =>
    name === "MouseMiddle"
        ? "Middle mouse"
        : name
              .replace(/^MouseUnknown\((\d+)\)$/, (_, b) => `Mouse ${+b + 3}`)
              .replace(/^Key([A-Z])$/, "$1")
              .replace(/^Num(\d)$/, "$1")
              .replace(/^Kp/, "Numpad ")
              .replace(/^Unknown\((\d+)\)$/, (_, vk) => `F${+vk - 111}`);
