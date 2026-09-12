# LiveVideoWallppr-Browser
Replace your browser's New Tab page with an animated wallpaper built from a video already on your computer. Nothing is ever uploaded — there is no server, no account, and no network request in this extension at all.

![Extension Screenshot](./screenshot/Screenshot_13-9-2026_25520_newtab.jpeg)

## Features

- **Local video wallpaper** — pick an MP4, WebM, or OGG file from your computer and it becomes your New Tab background. Autoplay, loop, mute, fit (cover/contain/fill), playback speed, and volume are all configurable.
- **Video library ("My Themes")** — store multiple videos, preview them, and switch the active wallpaper with one click.
- **Random video** — automatically rotate to a different saved video on every new tab (never repeats the same one twice in a row when you have more than one).
- **Clock & date** — real-time clock (12/24-hour), localized date, and an optional custom text label, all toggleable.
- **Custom positioning** — customize the screen position of the Clock, Date, Custom Text, and Web Shortcuts across 9 positions (Top Left, Top, Top Right, Center Left, Center, Center Right, Bottom Left, Bottom, Bottom Right) using a visual 3×3 grid picker or select dropdown.
- **Custom web shortcuts** — add, edit, and manage quick-access links to your favorite websites directly on your New Tab page with automatic favicons, letter monogram fallbacks, and customizable target tab behavior.
- **Overlay & blur** — adjustable darkness overlay and background blur so the UI stays readable over any footage.
- **Drag & drop** — drop a video file anywhere on the New Tab page, or onto the library panel, to add it.
- **Keyboard shortcuts** — `Space` play/pause, `M` mute/unmute, `R` restart, `S` open/close settings, `Esc` close settings.
- **Import/export settings** — back up or share your configuration as a small JSON file (video files themselves are never included in the export).
- **Fully local** — videos live in IndexedDB, settings live in `chrome.storage.local`. No backend, no external requests, no telemetry from the extension itself.

---

## Clone
```bash
git clone https://github.com/Id-Yuu/LiveVideoWallppr-Browser.git
cd LiveVideoWallppr-Browser
```

## Installation

```bash
npm install
```

## Development

Run the extension in a fresh, temporary browser profile with hot reloading:

```bash
npm run dev
```

By default this targets Chrome. To target a specific browser:

```bash
npm run dev -- --browser=edge
npm run dev -- --browser=firefox
```

Extension.js opens a disposable browser profile automatically — you don't need to load the extension manually while developing. Edit any file under `src/newtab/` and the New Tab page hot-reloads.

## Building for production

```bash
npm run build            # Chromium (default), output in dist/chromium
npm run build:chrome     # explicit Chrome build
npm run build:edge       # output in dist/edge
npm run build:firefox    # output in dist/firefox (Manifest V2)
```

---

## Add to your browser

1. Run a build (see above), e.g. `npm run build`.
2. Open `chrome://extensions` (or `edge://extensions`) in your browser.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `dist/chromium` folder (or `dist/edge` for Edge).
5. Open a new tab — you should see the empty state prompting you to add a video.

For Firefox: open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and select any file inside `dist/firefox` (e.g. `manifest.json`).

---


## Learn more

[Extension.js docs](https://extension.js.org).
