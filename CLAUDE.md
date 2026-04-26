# Orbis — Claude Context

Orbis is a personal IB Diploma school management and unified knowledge system built for **Sai Krithic A**, Year 1 IB student.

---

## Stack

| Layer | Tool | Status |
|---|---|---|
| Dashboard (PWA) | `index.html` + `data/tasks.json` | Built, deployed on GitHub Pages |
| Notes / source of truth | Obsidian vault in OneDrive (school Microsoft account) | Active |
| Task / knowledge DB | Notion (free tier) | Built — 6 databases live |
| Gmail automation | `scripts/gmail_to_notion.gs` (Google Apps Script) | Script ready, needs manual deploy |
| Archive | OneNote | To be migrated into Notion |

---

## Subjects

| Subject | Level |
|---|---|
| Maths AI | HL |
| Computer Science | HL |
| Business Management | HL |
| Spanish | Ab Initio |
| Chemistry | SL |
| English | SL |

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
| G11 | Grade 11 Finals (end-of-year exams, May–June 2026) |

---

## Notion Integration

- **Integration name:** orbis
- **Workspace:** Sai Krithic A's Space
- **API token:** stored in `.env` / passed via environment variable `NOTION_API_TOKEN` (never commit)
- **Root page ID:** `34a483ac69ec8051a6b8f3c2962056bf`
- **Root page:** Created, integration connected

### Notion Databases (all live)

| Database | ID | Description |
|---|---|---|
| Subjects | `34a483ac-69ec-81b3-...` | 6 subjects with level, IA format, grade targets |
| Tasks | `34a483ac-69ec-811b-ab6d-f4bdb283f187` | 55 tasks migrated; linked to Subjects |
| IA Tracker | — | One row per IA with status, score, word limit |
| TOK & EE | — | Page (not DB) tracking essay + exhibition progress |
| CAS Tracker | — | CAS activities log — currently empty |
| G11 Finals | — | 14 exam entries (May–June 2026) with syllabus topics |

**Subject page IDs (for relations):**

| Key | Subject | Notion page ID |
|---|---|---|
| maths | Maths AI HL | `34a483ac-69ec-81cf-ad26-fdf851d67a91` |
| cs | Computer Science HL | `34a483ac-69ec-8157-84d0-e0260df8e048` |
| bm | Business Management HL | `34a483ac-69ec-81fb-8be8-f744ddedb7fc` |
| spanish | Spanish Ab Initio | `34a483ac-69ec-81ca-89be-db12c723be47` |
| chem | Chemistry SL | `34a483ac-69ec-815e-856d-c81ccb84443b` |
| english | English Lang & Lit SL | `34a483ac-69ec-81a3-9599-f2c118afcdc7` |

---

## Obsidian Vault

- Stored in OneDrive (school Microsoft account)
- Source of truth for all notes and initial task data
- 55 tasks already in `data/tasks.json` synced from vault

---

## Git

- Repo: `sai-k27-0/orbis`
- Development branch: `claude/orbis-development-KR5mm`
- Never push to `main` without explicit permission

---

## Where We Are

### Completed
- Notion workspace fully scaffolded (6 databases + TOK & EE page)
- 55 tasks migrated from `data/tasks.json` into Notion Tasks DB
- G11 Finals populated with 14 exam entries from PDFs (exam TT + syllabus)
- GitHub Pages deployment live via GitHub Actions (`.github/workflows/deploy.yml`)
- Gmail → Notion automation script written (`scripts/gmail_to_notion.gs`)
- Exam PDFs stored in `data/g11-finals/`

### Pending (manual steps for Sai)
1. **Gmail automation** — go to script.google.com, paste `scripts/gmail_to_notion.gs`, fill in your Notion API token, run `setup()` once, then `createTimeTrigger()`
2. **ALLOWED_SENDERS** — forward a Toddle notification email, check the real sender address, add it to `CONFIG.ALLOWED_SENDERS` in the script
3. **CAS Tracker** — fill in actual CAS activities (currently 0 rows in Notion)
4. **OneNote migration** — OneNote content to be brought into Notion as archive (Phase 2 of roadmap)
