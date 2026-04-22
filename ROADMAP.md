# Roadmap

Planned milestones for Orbis, in order of priority.

---

## Phase 1 — Foundation (current)

- [x] PWA dashboard live with 55 tasks
- [x] Obsidian vault as source of truth for tasks
- [x] `sync-tasks.bat` to push Obsidian data → `tasks.json` → dashboard
- [x] Project memory files (CLAUDE.md, CHANGELOG.md, ROADMAP.md)
- [ ] Move Obsidian vault into OneDrive folder (school account)
- [ ] Import OneNote notebooks into Notion

## Phase 2 — Notion Setup

- [ ] Create Notion API integration token
- [ ] Claude builds Notion workspace structure:
  - Subjects database (one row per subject, with level, code, colour)
  - Tasks database (name, subject, type, due date, status, source)
  - IB Core tracker (EE, TOK, CAS)
  - Sources/Books database (title, subject, type, status, notes link)
- [ ] Migrate OneNote content into Notion (archive)
- [ ] Define what lives in Notion vs Obsidian (no overlap)

## Phase 3 — Obsidian → Notion Sync

- [ ] Write sync script (`sync-to-notion.py` or `sync-to-notion.js`)
  - Reads Obsidian vault `.md` files
  - Parses frontmatter metadata
  - Creates/updates pages in Notion via API
- [ ] Set up as Windows scheduled task (runs on startup or hourly)
- [ ] Test with a few notes before full vault

## Phase 4 — Claude Integration in Obsidian

- [ ] Install Obsidian Copilot or Smart Second Brain plugin
- [ ] Configure it to read the full vault
- [ ] Set up prompt templates for: summarising notes, generating study plans, quizzing from notes

## Phase 5 — Dashboard Improvements

- [ ] Load tasks from Notion API instead of static `tasks.json`
- [ ] Add "mark done" button that writes back to Notion
- [ ] Grade predictions from Notion data

---

## Notes

- Keep the PWA dashboard as the fast daily view (no login required)
- Notion is for structured management and long-term records
- Obsidian is for raw thinking, writing, and deep notes
- OneDrive is just storage — transparent in the background
