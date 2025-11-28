 # Watermart-Studio

Watermart-Studio is a React + TypeScript image watermarking editor built with Vite. It provides a modern, single-engine watermark renderer (canvas-based) and a responsive live preview overlay with feature parity between preview and export. The editor supports multi-image batch processing, multi-logo support with per-logo controls, image adjustments, and export-quality options (HD, Standard, Small).

This repository is the application source. The README below explains development, features, and how to push this project to a remote GitHub repository (commands for PowerShell included).

---

## Key Features

- Single modern watermark engine (canvas) used for final exports with DPR-aware rendering and HD PNG output.
- Live DOM preview that mirrors the engine sizing and positioning rules for WYSIWYG behavior.
- Multi-logo support with per-logo metadata: scale, position (draggable in preview), opacity, and rotation.
- Batch editing: apply watermarks to many images and export them in selected quality.
- Image adjustments (exposure, contrast, saturation, temperature) applied in preview and export.
- Export quality options: `hd` (high DPI, PNG), `standard` (JPEG high quality), and `small` (downscaled JPEG).

## Repo Structure (important files)

- `src/pages/Editor.tsx` — main editor page orchestrating preview, controls, and export flows.
- `src/components/WatermarkPreview.tsx` — live DOM preview overlay; handles dragging and per-logo placement.
- `src/components/WatermarkControls.tsx` — UI controls for watermark configuration (text, logos, styles, transforms).
- `src/components/ModernWatermarkControlsWrapper.tsx` — adapter mapping the app state to the controls component.
- `src/utils/watermarkEngine.ts` — the canvas-based rendering engine used for final exports.
- `src/types/watermark.ts` — shared types (now includes rich `logos` metadata and `imageScale`).

## Development (run locally)

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server (Vite):

```powershell
npm run dev
```

3. Type-check the project (useful before committing):

```powershell
npx tsc --noEmit --pretty true
```

4. Build for production:

```powershell
npm run build
```

5. Preview production build locally (optional):

```powershell
npm run serve
```

## How to use the editor (quick)

1. Open the editor in your browser (Vite dev server). Upload images via the gallery.
2. Upload one or more logos in the Watermark controls panel. Each logo receives a thumbnail and a scale input.
3. Drag logos in the preview to position them anywhere in the image. Positions are stored per-logo and will be used in exports.
4. Adjust text, style, glow, rotation, and image adjustments.
5. Choose `Apply & Export` or use the Batch modal to select multiple images and export at `HD`, `Standard`, or `Small` quality.

Notes:
- `HD` exports render the full image at a higher backing-store DPR (2× multiplier) and produce a PNG for crisper text and logos.
- `imageScale` adjusts the canvas CSS size multiplier so you can upscale the entire image before rendering — useful when you want larger final images.

## Pushing this repository to GitHub (PowerShell)

Below are the exact commands you suggested. Run them from the repository root (`c:\Users\USER\Downloads\watermark-studio`) in PowerShell. You will be prompted for credentials (or use a PAT / SSH remote as you prefer).

```powershell
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Wishot-Cipher/Watermart-Studio.git
git push -u origin main
```

Notes about the push:
- If the remote repo already exists and has commits, `git push` may fail with a non-fast-forward error. In that case, either pull & merge first or force push only if you understand the consequences.
- If you prefer SSH, set the remote URL to the SSH form: `git@github.com:Wishot-Cipher/Watermart-Studio.git` and ensure your SSH keys are loaded.

## Optional: Create a helpful `.gitignore`

You likely want to ignore `node_modules`, Vite build artifacts, and local editor files. Create a `.gitignore` with these contents:

```
node_modules/
dist/
.vite/
.env
.DS_Store
.idea/
*.log
```

To create it locally:

```powershell
echo "node_modules/`n dist/`n .vite/`n .env`n .DS_Store`n .idea/`n *.log" > .gitignore
```

## Troubleshooting

- Dev server exits with code 1: run `npx tsc --noEmit` to check TypeScript errors first. Fix reported type errors before starting Vite.
- If images fail to export or logos don't appear, open the browser console and look for `Engine: renderWatermark start` and `Engine: drawWatermark` diagnostic logs — they help diagnose DPR, canvas size, and positioning issues.

## Contributing

If you want me to continue making edits (per-logo rotation UI, persist `logos` per-image, add debug export helper, or clean up Tailwind class names), tell me which task to prioritize and I will make the changes and prepare a PR-ready commit for you.

---

If you want, I can:

- create `.gitignore` for you in this repo, or
- update README further to include screenshots and example exports (you'll need to provide example images), or
- generate a commit and show you the exact PowerShell commands to push (I can't push from here).

Tell me which follow-up action you'd like and I'll do it next.
