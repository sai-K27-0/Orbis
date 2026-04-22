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
combining Obsidian, Notion, and OneDrive.

The Netlify site (orbis.sam0sa.me) has been taken down. The PWA dashboard
still exists in the repo but is no longer publicly hosted.

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
├── index.html          # PWA dashboard (offline, no longer hosted)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── data/
│   └── tasks.json      # 55 tasks exported from Obsidian vault
├── sync-tasks.bat      # Windows script: Obsidian → tasks.json
├── push-to-github.bat  # Windows script: push to GitHub
├── CLAUDE.md           # This file — project memory for Claude
├── CHANGELOG.md        # Version history
├── ROADMAP.md          # Future plans
└── README.md           # Project description
```

---

## Knowledge Management System

Three tools, each with a clear role:

### 1. Obsidian (thinking + writing layer)
- Vault stored in OneDrive (school Microsoft account) — already done
- Deep notes, ideas, atomic concepts, IB assignments
- Frontmatter metadata on every note for Dataview queries
- Obsidian Copilot / Smart Second Brain plugin for Claude AI analysis
- Source of truth for task data → exported to `data/tasks.json`

### 2. Notion (structured data + dashboard layer)
- Free tier — no subscription needed
- Subjects database, Tasks database, IB Core tracker, Sources database
- OneNote content to be imported into Notion (archive)
- Claude manages Notion via the API

### 3. OneDrive (cloud storage)
- School Microsoft Student account — free
- Stores Obsidian vault — already set up
- OneNote syncs here natively

### Data flow
```
Obsidian vault (OneDrive) → sync-tasks.bat → data/tasks.json → PWA dashboard
Obsidian vault            → Claude plugin  → AI analysis
Notion                    → Notion API     → Claude management
OneNote                   → import         → Notion (archive)
```

---

## Notion API

- Integration name: `orbis`
- Workspace: `Sai Krithic A's Space`
- Workspace ID: `42e483ac-69ec-8180-a074-0003730ae384`
- Bot user ID: `34a483ac-69ec-81f6-99e1-0027ec2cafe3`
- Token: stored separately — ask Sai to provide it

### What still needs to be done in Notion:
1. Sai creates a blank page called `Orbis` in Notion manually
2. Connects the `orbis` integration to that page (... → Add connections → Orbis)
3. Pastes the page URL here so Claude can extract the page ID
4. Claude then builds all databases inside that page:
   - Subjects database
   - Tasks database (linked to `data/tasks.json` structure)
   - IB Core tracker (EE, TOK, CAS)
   - Sources/Books database

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
2. Read `ROADMAP.md` to see current phase
3. Check branch: `git branch --show-current`
4. Check recent commits: `git log --oneline -5`
5. Ask Sai what to work on if not told

---

## Key Decisions Made

- Obsidian vault lives in OneDrive (not Obsidian Sync — free via school account) ✓
- Notion free tier is enough — no subscription needed
- OneNote migrates to Notion → kept as archive only
- Netlify site (orbis.sam0sa.me) deleted ✓
- PWA dashboard stays in repo but not publicly hosted
- `data/tasks.json` is the bridge between Obsidian and the dashboard
- No over-engineering — scripts stay simple, no frameworks unless needed
