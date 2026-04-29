# Orbis — IB School Brain

> Sai Krithic A · IB Diploma Year 1 · 2025–2026

Orbis is a unified school management system built around three layers:

| Layer | Tool | Purpose |
|---|---|---|
| **Notes / Writing** | Obsidian (`vault/`) | Class notes, IA drafts, EE, TOK journal, daily capture |
| **Structured data** | Notion | Tasks, grades, IA tracker, G11 Finals, CAS log |
| **Dashboard (PWA)** | `index.html` | Quick-glance view — tasks, timer, countdown, grades |

---

## Subjects

| Subject | Level |
|---|---|
| Maths AI | HL |
| Computer Science | HL |
| Business Management | HL |
| Spanish | Ab Initio |
| Chemistry | SL |
| English Lang & Lit | SL |

---

## Repo Structure

```
Orbis/
├── vault/                   ← Obsidian school brain
│   ├── Home.md              ← dashboard (open this first)
│   ├── 00 - Inbox/          ← quick capture
│   ├── 01 - Daily Notes/    ← one note per day
│   ├── 02 - Subjects/       ← 6 subjects with notes & templates
│   ├── 03 - IB Core/        ← TOK, EE, CAS
│   ├── 04 - G11 Finals/     ← revision notes + timetable
│   ├── 05 - Resources/      ← past papers, textbooks
│   └── Templates/           ← 7 reusable templates
├── scripts/
│   ├── build_notion.py      ← builds Notion workspace from scratch
│   └── gmail_to_notion.gs   ← Gmail → Notion task automation
├── data/
│   ├── tasks.json           ← 55 tasks (source for Notion migration)
│   └── g11-finals/          ← exam timetable + syllabus PDFs
├── .github/workflows/
│   └── deploy.yml           ← GitHub Pages auto-deploy on push to main
├── index.html               ← PWA dashboard
├── sw.js                    ← service worker (offline)
├── manifest.json            ← PWA manifest
├── ROADMAP.md
├── CHANGELOG.md
└── SETUP.md                 ← start here for local setup
```

---

## Quick Start

See **[SETUP.md](SETUP.md)** for the full step-by-step local setup guide.

Short version:
1. Clone repo → copy `vault/` into Obsidian → install 3 plugins
2. Set `NOTION_API_TOKEN` env var → run `scripts/build_notion.py` (already done)
3. Deploy `gmail_to_notion.gs` to Google Apps Script → run `setup()` + `createTimeTrigger()`

---

## Obsidian Plugins (required)

Install via Obsidian → Settings → Community plugins:

| Plugin | Purpose |
|---|---|
| **Dataview** | Live queries on Home dashboard |
| **Calendar** | Visual daily notes sidebar |
| **Spaced Repetition** | Flashcard review for exam revision |

---

## Assessment Types

| Code | Name |
|---|---|
| FA | Formative Assessment (monthly, highest priority) |
| STEAM | STEAM Group Task |
| WT | Writing Task |
| SDL | Self-Directed Learning |
| HW | Homework |
| IA | Internal Assessment (all subjects) |
| TOK | Theory of Knowledge |
| EE | Extended Essay (Business Management HL) |
| G11 | Grade 11 Finals (May–June 2026) |

---

## Deploy (PWA Dashboard)

The dashboard auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

To view: `https://sai-k27-0.github.io/Orbis`

Local development — no build step needed:
```bash
open index.html   # or just double-click
```

---

*Built with Claude Code · IB May 2027 session*
