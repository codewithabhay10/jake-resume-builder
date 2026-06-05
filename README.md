# Jake's Resume Builder

A form-driven, **client-side** résumé builder with a **live preview** that reproduces
Jake Gutierrez's popular MIT-licensed **"Jake's Resume"** LaTeX template — pixel-for-pixel
in the browser and as **compile-ready `.tex`** for Overleaf. Inspired by
[easylatexresume.com](https://easylatexresume.com). One template, done faithfully.

The preview renders in **Computer Modern** (LaTeX's default font), so what you see on
screen matches what compiles.

---

## Features

- **Live preview** on a US-Letter page in real Computer Modern (self-hosted `CMU Serif`).
- **Form-driven editor** with a left **section sidebar**, middle **section form**, and a
  sticky **preview** on the right.
- **Sections**: Personal Info, Additional Social Links, Education, Experience, Projects,
  Technical Skills — plus optional add-on templates and **custom sections**.
- **Add-on section templates** via a searchable, category-filtered modal
  (Professional / Academic / Technical / Personal): Certifications, Volunteer Experience,
  Licenses, Professional Summary, Awards, Publications, Patents, Conference Presentations,
  Relevant Coursework, Open Source Contributions, Languages, Interests & Hobbies, and
  **Create Custom Section**.
- **Drag-and-drop reordering** of sections, entries, bullets, social links, and skill rows
  (`@dnd-kit`).
- **Rich-text bullets** — a minimal `contenteditable` editor with **Bold (Ctrl+B)**,
  **Italic (Ctrl+I)**, **Underline (Ctrl+U)**, **Link (Ctrl+K)**, and clear-formatting.
- **Completion meter** (`X/Y (NN%)`) based on filled required fields per section.
- **Top-bar actions**: Load Sample Data, Clear Data (with confirm), Reorder Section,
  Generate Resume.
- **Export**: **Copy LaTeX**, **Download `.tex`**, and **Export PDF** (prints the HTML
  preview to a Letter page via `react-to-print`).
- **Auto-save** — everything (including section order) persists to `localStorage` and is
  restored on reload. No backend, no accounts.

---

## Tech stack

| Concern            | Choice                                            |
| ------------------ | ------------------------------------------------- |
| Framework / build  | React 19 + Vite + TypeScript                      |
| Styling            | Tailwind CSS v4 (`@tailwindcss/vite`)             |
| State + persistence| Zustand + `persist` (localStorage) + Immer        |
| Drag & drop        | `@dnd-kit/core` + `@dnd-kit/sortable`             |
| Rich text          | `contenteditable` + `document.execCommand`        |
| PDF / print        | `react-to-print`                                  |
| Font               | `computer-modern` (CMU Serif woff2, self-hosted)  |

---

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # typecheck (tsc -b) + production build to dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

> Requires Node 18+ (developed on Node 24).

### First run

The app starts with the six empty core sections. Click **Load Sample Data** in the top bar
to fill in the classic "Jake Ryan" CS-student example, then edit any field and watch the
preview update live.

---

## How the template is reproduced

### Font (exact)

LaTeX's default body font is **Computer Modern Roman**. The web build (`CMU Serif`,
Roman / Italic / Bold / BoldItalic) is copied from the [`computer-modern`](https://www.npmjs.com/package/computer-modern)
package into `public/fonts/` and self-hosted via `@font-face` in `src/index.css`
(11 pt base; section titles use small caps for `\scshape`).

### Layout & spacing

`src/components/ResumeDocument.tsx` + the resume CSS in `src/index.css` mirror the LaTeX
metrics: letterpaper, ~0.5 in margins (Jake widens `\textwidth` by 1 in), the `\Huge`
small-caps name, the centered `phone | email | links` contact line, each `\section` with a
full-width `\titlerule` beneath a small-caps title, two-row `\resumeSubheading` entries,
single-row `\resumeProjectHeading` projects, tiny bullet markers, and bullet-free skills
lines — all with the template's tight negative-`\vspace` rhythm.

### LaTeX output

`src/latex/generateLatex.ts` emits the **authentic Jake's-Resume preamble** (article, 11 pt,
letterpaper; `latexsym`, `fullpage`, `titlesec`, `marvosym`, `color`, `enumitem`,
`hyperref[hidelinks]`, `fancyhdr`, `babel`, `tabularx`, `\input{glyphtounicode}`) plus the
standard `\resumeItem` / `\resumeSubheading` / `\resumeProjectHeading` /
`\resumeSubHeadingListStart…End` macros, then fills `\begin{document}` with your data.

- Rich text maps to LaTeX: **bold** → `\textbf{}`, *italic* → `\textit{}`,
  underline → `\underline{}`, link → `\href{url}{text}`.
- User input is LaTeX-escaped (`\ & % $ # _ { } ~ ^`) and date ranges are normalized to
  en-dashes (`May 2018 -- May 2020`).
- The HTML preview and the `.tex` are kept structurally identical, so the preview matches
  what compiles on Overleaf.

To compile the downloaded file, drop it into a new [Overleaf](https://overleaf.com) project
(or run `pdflatex`).

---

## Project structure

```
src/
  types.ts                 # Resume data model (discriminated-union Section[])
  store/useResumeStore.ts  # Zustand store: all mutations + localStorage persistence
  data/
    defaults.ts            # Empty entry factories + initial core sections
    sampleData.ts          # "Jake Ryan" sample resume
    sectionTemplates.ts    # Add-on template catalog + picker filters
  latex/
    escape.ts              # LaTeX escaping + date/url helpers
    richToLatex.ts         # contenteditable HTML -> LaTeX
    generateLatex.ts       # Full Jake's-Resume .tex generator
  utils/
    render.ts              # Shared preview/.tex helpers (contact line, renderable checks)
    completion.ts          # Per-section completeness + overall meter
    richText.ts            # Sanitize / empty-check bullet HTML
    cn.ts, id.ts
  components/
    TopBar, SectionSidebar, SectionEditor, PreviewPane, ResumeDocument,
    TemplatePickerModal, BulletEditor, BulletList, icons
    forms/                 # One form per section type + SectionFormRouter
    common/                # SortableList, SortableItem, EntryCard, ui (Field/Button)
  App.tsx                  # 3-pane layout + global wiring
public/fonts/              # Self-hosted CMU Serif woff2
```

---

## Notes & limitations

- **PDF export** uses the browser's print pipeline (`react-to-print`) on the HTML preview
  with `@page { size: letter }`. For a byte-identical LaTeX PDF, use **Download .tex** and
  compile on Overleaf.
- Bullet HTML is sanitized to a small allow-list (`b/strong, i/em, u, a, br`) before being
  rendered or converted to LaTeX.
- Everything is local — clearing your browser storage clears your resume.

Template © Jake Gutierrez, MIT License.
