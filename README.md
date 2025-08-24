# Landing Blocks — No‑Code Landing/Portfolio Builder

Assemble beautiful landing pages from ready‑made blocks, customize themes, and export a production‑ready static site (HTML/CSS/Assets) — no backend required.

• Tech: React + Vite + TypeScript
• Live Demo: https://floridaliza5000-byte.github.io/No-code-Landing-Page/

## Features
- Block Library: Hero, Features, Gallery, Testimonials, Pricing, Contact
- Saved Blocks Library: save any configured section and reuse it across projects
- Theme Presets: one‑click Light/Dark and curated palettes; Google Fonts injection on export
- Visual Inspector: edit content and options with a friendly panel
- Undo/Redo History: up to 50 snapshots for safe exploration
- Device Preview: Desktop / Tablet / Mobile frame toggles
- Keyboard Shortcuts:
  - Ctrl/Cmd+Z → Undo, Ctrl/Cmd+Shift+Z (or Ctrl/Cmd+Y) → Redo
  - Delete/Backspace → Delete selected block
  - Ctrl/Cmd+D → Duplicate selected block
  - Alt+ArrowUp / Alt+ArrowDown → Move block up/down
- Image Handling: upload images (stored as data URLs in the editor)
- Optimized Export:
  - Extracts images into `/assets` and rewrites references
  - Optional resize/compress (WebP preferred, JPEG fallback)
  - Injects selected Google Fonts for the chosen theme
- SEO: editable title/description; meta tags included in export
- Contact Forms: choose handler per project
  - None (static demo)
  - Formspree (add your form ID)
  - Netlify Forms (adds the correct HTML attributes)

## Quick Start
```bash
npm install
npm run dev
```
Open the local URL printed to the terminal. Add blocks from the left palette, click blocks to edit in the Inspector, and use the bottom‑left device toggles to preview.

## Exporting Your Site
Click “Export ZIP” to download a static bundle containing:
- `index.html` — generated markup from your configured blocks
- `styles.css` — theme variables and layout styles
- `assets/` — extracted and optionally optimized images
- `README-demo.md` — quick usage notes

Host the exported folder on any static host (GitHub Pages, Netlify, Vercel static, S3, etc.). If you used Netlify Forms, deploy on Netlify to enable form captures. For Formspree, ensure your form ID is valid.

## Screenshots & GIFs (Marketing)
- Use the in‑app “Download Screenshot” button to capture the current page (works with device preview).
- For GIFs, record your screen while interacting with the editor or the exported site (e.g., ScreenToGif on Windows). Aim for 5–10 seconds demonstrating: adding a block, switching theme preset, exporting.

## Customization (Developers)
- Add new blocks in `src/blocks/blocks.tsx` by implementing `createDefaultProps`, `render`, and `toHTML`.
- Editor UI: `src/components/*` (Palette, Inspector, Canvas)
- Export pipeline: `src/export/exportZip.ts`
- App shell: `src/App.tsx`, styling in `src/styles.css`

## Build & Deploy (Demo)
Local production build:
```bash
npm run build:gh
```
Deploy to GitHub Pages (publishes `dist/` to `gh-pages`):
```bash
npm run deploy
```

## License & Support
- License: for marketplace distribution, follow the marketplace’s commercial licensing terms.
- Support: bug fixes and Q&A for listed features. Custom development or bespoke integrations are not included.
