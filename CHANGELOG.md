# Changelog

All notable changes to Orbis are documented here.

---

## [Unreleased] — dev branch `claude/orbis-development-KR5mm`

### Added
- `vault/` — full Obsidian school brain scaffold
  - Home dashboard with live Dataview queries
  - 6 subject folders (Topics, FA Prep, IA) with IB-accurate overview notes
  - IB Core section: TOK (Essay + Exhibition), EE (Business Management), CAS
  - G11 Finals timetable + per-subject revision notes
  - 7 templates: Daily Note, Class Note, FA Prep, Topic Summary, IA Journal, TOK Journal, CAS Log, EE Journal
  - Obsidian config: daily notes, core plugins, community plugin manifests (Dataview, Calendar, Spaced Repetition)
- `scripts/gmail_to_notion.gs` — Google Apps Script automating Gmail → Notion task creation
  - Parses Toddle, Outlook-forwarded, and teacher emails
  - Detects subject, task type, due date, priority from email content
  - Runs every 30 minutes via Apps Script time trigger
- `data/g11-finals/` — exam PDFs moved from repo root
  - `GRD 11-FINAL EXAM TT 2026.pdf`
  - `Gr11 Syllabus Focus Final Exam.pdf`
- `SETUP.md` — step-by-step local setup guide (Obsidian, Notion, Gmail)

### Changed
- `CLAUDE.md` — updated to reflect all 6 live Notion databases, subject IDs, completed vs pending work
- `ROADMAP.md` — Phase 1 & 2 marked complete, Phase 3 (PWA Sync) on hold

---

## [0.3.0] — Notion build complete

### Added
- `scripts/build_notion.py` — full Notion workspace builder
  - Subjects DB (6 subjects with level, IA format, grade targets)
  - Tasks DB (55 tasks migrated from `data/tasks.json`)
  - IA Tracker (one row per subject IA)
  - TOK & EE page (essay + exhibition tracking, bonus points matrix)
  - CAS Tracker DB
  - G11 Finals DB (14 exam entries, May–June 2026, with syllabus topics)
- Notion root page connected at `34a483ac69ec8051a6b8f3c2962056bf`

### Fixed
- Task type misclassifications in Notion Tasks DB (IA, G11 entries corrected)
- Renamed HYE → G11 Finals throughout

---

## [0.2.0] — GitHub Pages deployment

### Added
- `.github/workflows/deploy.yml` — GitHub Actions deployment to GitHub Pages on push to `main`
- `manifest.json` — fixed `start_url` from `/` to `./index.html` for GitHub Pages subpath

### Changed
- `sw.js` — bumped cache to `orbis-v6`, switched to relative asset paths

---

## [0.1.0] — Initial PWA dashboard

### Added
- `index.html` — full PWA dashboard (task manager, FA alerts, IB Core tracker, grade calculator, study timer, exam countdown, quick notes)
- `data/tasks.json` — 55 tasks seeded from Obsidian vault
- `manifest.json` — PWA manifest
- `sw.js` — service worker with offline caching
- `CLAUDE.md` — project context for Claude
- `ROADMAP.md` — 5-phase development roadmap
