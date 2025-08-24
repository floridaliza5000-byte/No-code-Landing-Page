# Landing Blocks — No‑Code Landing/Portfolio Builder

A React + Vite + TypeScript app to assemble landing pages from preset blocks and export a static HTML/CSS ZIP.

## Features
- Block presets: Hero, Features, Gallery, Testimonials, Pricing, Contact
- Theme controls: colors and font family via CSS variables
- Inspector: edit block props as JSON
- Export: generates index.html + styles.css (no backend)

## Getting Started
```bash
npm install
npm run dev
```
Open the printed local URL. Add blocks from the left panel, edit content on the right, then click "Export ZIP".

## Export
- Produces `index.html`, `styles.css`, and `README.txt` inside a ZIP.
- The exported page is pure static and can be hosted on any static hosting.
- Contact form is a stub; integrate EmailJS or your backend.

## Customize
- Add new blocks in `src/blocks/blocks.ts` (provide `createDefaultProps`, `render`, `toHTML`).
- Adjust editor UI in `src/components/*`.
- Styling: app UI in `src/styles.css`, exported page styles in `src/export/exportZip.ts` (`exportedCss`).

## Packaging (CodeCanyon)
- Include: `src/`, `index.html` (dev entry), `package.json`, `README.md`, `CHANGELOG.md`, `LICENSE`, `dist/` (optional built demo), and `docs/`.
- Provide demo screenshots and an animated GIF.
- Mention that external images (gallery) use public placeholders.

## License & Support
- Single-use commercial license as per marketplace terms.
- Support: bug fixes and Q&A; customization not included.
