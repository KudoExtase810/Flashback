// Run: npm run release
// Builds the signed installer and writes release/ with the two files to upload to a GitHub release.
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const conf = JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8"));
const { version } = conf;
const endpoint: string = conf.plugins.updater.endpoints[0];
const repo = /github\.com\/([^/]+\/[^/]+)\/releases/.exec(endpoint)?.[1];
if (!repo) throw new Error("The update endpoint in src-tauri/tauri.conf.json isn't a GitHub releases URL.");

const keyPath = process.env.TAURI_SIGNING_PRIVATE_KEY_PATH ?? join(homedir(), ".tauri", "flashback.key");
if (!existsSync(keyPath)) throw new Error(`Signing key not found at ${keyPath}`);

// ponytail: the key has no password. If you add one, set TAURI_SIGNING_PRIVATE_KEY_PASSWORD before running.
// The updater files (signed installer) are only made here: a plain `npm run tauri build` needs no key.
execSync("npm run tauri build -- --config src-tauri/tauri.release.conf.json", {
    stdio: "inherit",
    env: {
        ...process.env,
        TAURI_SIGNING_PRIVATE_KEY: readFileSync(keyPath, "utf8"),
        TAURI_SIGNING_PRIVATE_KEY_PASSWORD: process.env.TAURI_SIGNING_PRIVATE_KEY_PASSWORD ?? "",
    },
});

const installer = `Flashback_${version}_x64-setup.exe`;
const built = join("src-tauri", "target", "release", "bundle", "nsis", installer);
if (!existsSync(`${built}.sig`)) throw new Error(`No ${installer}.sig next to the installer: was it built with the signing key?`);

rmSync("release", { recursive: true, force: true });
mkdirSync("release");
copyFileSync(built, join("release", installer));
writeFileSync(
    join("release", "latest.json"),
    JSON.stringify(
        {
            version,
            notes: "",
            pub_date: new Date().toISOString(),
            platforms: {
                "windows-x86_64": {
                    signature: readFileSync(`${built}.sig`, "utf8").trim(),
                    url: `https://github.com/${repo}/releases/download/v${version}/${installer}`,
                },
            },
        },
        null,
        2,
    ),
);

console.log(`\nDone. On GitHub, create a release tagged v${version} and upload both files from release/:\n  ${installer}\n  latest.json`);
