# Orbis Roadmap

## Phase 1 — Notion Foundation ✅

- [x] Create "Orbis" root page in Notion manually
- [x] Connect orbis integration to root page
- [x] Build Subjects database (6 subjects)
- [x] Build Tasks database (linked to Subjects, 55 tasks migrated)
- [x] Build IA Tracker database (one row per subject IA)
- [x] Build TOK & EE page
- [x] Build CAS Tracker database
- [x] Build G11 Finals database (14 exam entries, May–June 2026)

## Phase 2 — Data Migration ✅

- [x] Migrate 55 tasks from `data/tasks.json` into Notion Tasks database
- [ ] Migrate OneNote content into Notion as archive *(skipped — building fresh in Obsidian)*

## Phase 2.5 — Obsidian School Brain ✅

- [x] Scaffold full Obsidian vault structure (6 subjects, IB Core, G11 Finals)
- [x] Create 7 note templates (Daily Note, Class Note, FA Prep, Topic Summary, IA Journal, TOK Journal, CAS Log, EE Journal)
- [x] Configure Obsidian plugins (Dataview, Calendar, Spaced Repetition)
- [ ] Copy vault to local machine and open in Obsidian *(manual — see SETUP.md)*
- [ ] Install and enable community plugins *(manual — see SETUP.md)*
- [ ] Fill in works studied for English IA
- [ ] Fill in CS HL option topic
- [ ] Fill in EE research question once decided

## Phase 3 — Automation

- [x] Write Gmail → Notion automation script (`scripts/gmail_to_notion.gs`)
- [ ] Deploy script to Google Apps Script *(manual — see SETUP.md)*
- [ ] Add school/Toddle sender address to `ALLOWED_SENDERS`
- [ ] Fill in CAS Tracker with actual CAS activities

## Phase 4 — PWA Sync *(on hold)*

- [ ] Connect PWA dashboard to Notion API (read tasks, IB Core data)
- [ ] Remove hardcoded `data/tasks.json` dependency
- [ ] Re-deploy updated dashboard

## Phase 5 — Obsidian ↔ Notion Sync

- [ ] Automate pushing new Obsidian tasks/notes into Notion
- [ ] Keep Obsidian as writing surface, Notion as structured DB

## Phase 6 — Advanced Tracking

- [ ] Grade calculator pulling live data from Notion
- [ ] EE / TOK / CAS progress dashboard
- [ ] Exam countdown integrated with Notion calendar
- [ ] Study session logs stored in Notion
