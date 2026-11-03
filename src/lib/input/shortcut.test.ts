// Shortcut names recorded in the webview must match what rdev reports in game.
import { test } from "node:test";
import assert from "node:assert/strict";
import { shortcutFromButton, shortcutFromCode, shortcutLabel } from "./shortcut.ts";

test("keyboard codes -> rdev names", () => {
    assert.equal(shortcutFromCode("KeyG"), "KeyG");
    assert.equal(shortcutFromCode("Digit5"), "Num5");
    assert.equal(shortcutFromCode("Numpad0"), "Kp0");
    assert.equal(shortcutFromCode("F7"), "F7");
    assert.equal(shortcutFromCode("F13"), "Unknown(124)");
    assert.equal(shortcutFromCode("Period"), "Dot");
    assert.equal(shortcutFromCode("AltLeft"), "Alt");
    assert.equal(shortcutFromCode("LaunchMail"), undefined);
});

test("mouse buttons: left is never a shortcut", () => {
    assert.equal(shortcutFromButton(0), undefined);
    assert.equal(shortcutFromButton(3), "MouseUnknown(1)");
});

test("labels", () => {
    assert.deepEqual(
        ["KeyG", "Kp0", "MouseUnknown(1)", "MouseUnknown(2)", "Unknown(124)", "F7"].map(shortcutLabel),
        ["G", "Numpad 0", "Mouse 4", "Mouse 5", "F13", "F7"],
    );
});
