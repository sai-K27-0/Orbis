# CLAUDE.md — Orbis Project Memory

This file gives Claude full context at the start of every new session.
Read this before doing anything else in the repo.

---

## What is Orbis?

Orbis is a personal IB Diploma school management system built by Sai.
It started as a PWA web dashboard (`index.html`) that tracks tasks, exams,
IB Core progress, grades, and study time. It is accessible from any device
via browser and is installable as a home screen app (PWA).

The project is evolving into a full **unified knowledge management system**
combining Obsidian, Notion, and OneDrive — described in the plan below.

---

## IB Subjects

| Subject             | Level       | Code   |
|---------------------|-------------|--------|
| Maths AI            | HL          | maths  |
| Computer Science    | HL          | cs     |
| Business Management | HL          | bm     |
| Spanish Ab Initio   | Ab Initio   | sp     |
| Chemistry           | SL          | ch     |
| English A Lang Lit  | SL          | en     |
| Theory of Knowledge | IB Core     | tok    |
| Extended Essay      | IB Core     | ee     |
| CAS                 | IB Core     | cas    |

## Assessment Types

| Code  | Name                    | Priority   |
|-------|-------------------------|------------|
| fa    | Formative Assessment    | Highest    |
| steam | STEAM Group Task        | High       |
| wt    | Writing Task            | Medium     |
| sdl   | Self-Directed Learning  | Medium     |
| hw    | Homework                | Normal     |

---

## Repo Structure

```
Orbis/
├── index.html          # Main PWA dashboard (single-file app)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline cache)
├── data/
│   └── tasks.json      # Task data exported from Obsidian vault
├── sync-tasks.bat      # Windows script: Obsidian → tasks.json
├── push-to-github.bat  # Windows script: push to GitHub
├── CLAUDE.md           # This file — project memory for Claude
├── CHANGELOG.md        # Version history
├── ROADMAP.md          # Future plans
└── README.md           # Public project description
```

---

## Knowledge Management Plan

Sai is building a unified study knowledge base using three tools:

### 1. Obsidian (thinking + writing layer)
- Stored in OneDrive (school Microsoft account) for free cloud sync
- Used for deep notes, ideas, atomic concepts, IB assignments
- Metadata/frontmatter on every note for Dataview queries
- Claude plugin (Obsidian Copilot or Smart Second Brain) for AI analysis
- **Source of truth for task data** — exported to `data/tasks.json` via `sync-tasks.bat`

### 2. Notion (structured data + dashboard layer)
- Free tier is sufficient for solo use
- Used for: course databases, book/source tracking, progress dashboards, structured records
- OneNote content imported via Notion's built-in OneNote importer
- Notion API token needed to allow Claude to create/manage structure programmatically

### 3. OneDrive (cloud storage)
- School Microsoft Student account — free
- Stores Obsidian vault folder (auto-syncs to all devices)
- OneNote already syncs here natively

### Data flow
```
Obsidian vault (OneDrive) → sync-tasks.bat → data/tasks.json → index.html (PWA)
Obsidian vault            → Claude plugin  → AI analysis
Notion                    → Notion API     → Claude management
OneNote                   → import         → Notion (archive)
```

---

## Notion API Integration (planned)

To let Claude manage Notion (create databases, tables, pages, tags):
1. Sai generates a Notion API token at notion.so/my-integrations
2. Token is stored as environment variable `NOTION_TOKEN`
3. Claude uses the token via Python/Node scripts to:
   - Create subject databases with properties (status, type, due date)
   - Add pages for tasks, notes, sources
   - Build dashboards and filtered views
   - Sync Obsidian content into Notion pages

---

## Obsidian → Notion Sync (planned)

A script (Python or Node.js) that:
- Watches the Obsidian vault folder on OneDrive
- Reads frontmatter metadata from `.md` files
- Pushes new/updated notes to Notion as pages
- Runs as a scheduled task on Windows (Task Scheduler) or manually

---

## Development Branch

Active branch: `claude/setup-obsidian-database-Laj1E`
Base branch: `main`
Remote: `origin` (GitHub — sai-k27-0/orbis)

Always develop on `claude/setup-obsidian-database-Laj1E` unless told otherwise.
Push with: `git push -u origin claude/setup-obsidian-database-Laj1E`

---

## Session Checklist (start of every new session)

1. Read this file (`CLAUDE.md`)
2. Check current branch: `git branch --show-current`
3. Check recent commits: `git log --oneline -5`
4. Read `ROADMAP.md` to see what's next
5. Ask Sai what to work on today if not told

---

## Key Decisions Made

- Obsidian vault lives in OneDrive (not Obsidian Sync — free via school account)
- Notion free tier is enough — no subscription needed
- OneNote will be migrated to Notion and kept as archive only
- Web dashboard (`index.html`) stays as the live task/exam view
- `data/tasks.json` is the bridge between Obsidian and the web dashboard
- No over-engineering — scripts stay simple, no frameworks unless needed
