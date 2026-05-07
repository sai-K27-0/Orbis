# Orbis — AI Context File

> Read this first. It gives full context about Sai Krithic's setup so you don't need to re-ask anything.
> Last updated: 2026-05-07

---

## Who This Is For

**Sai Krithic A** — Year 1 IB Diploma student (2025–2026), Indus International School, Bangalore.  
Grade target: 7 in all subjects.

---

## Devices & Accounts

| Device | Use |
|---|---|
| MacBook Air | Primary machine — all dev + Obsidian |
| Samsung Galaxy Tab S10 FE + S Pen | Handwritten notes via Obsidian |

| Account | Details |
|---|---|
| Personal Gmail | saikrithic62009@gmail.com |
| Personal Microsoft / OneDrive | saikrithic62009@gmail.com (Microsoft account created with Gmail) |
| School Microsoft | saikrithic.a@indusschool.com — school SharePoint/OneNote only |
| School emails | Auto-forward from Outlook → saikrithic62009@gmail.com |

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

## The Orbis Stack

| Layer | Tool | Status |
|---|---|---|
| Notes / source of truth | Obsidian vault → personal OneDrive | ✅ Active |
| Task / knowledge DB | Notion | ✅ Active |
| Gmail → Notion automation | Google Apps Script (runs every 30 min) | ✅ Live |
| Tablet sync | Obsidian + Remotely Save → personal OneDrive | 🔧 Setup in progress |
| Dashboard (PWA) | `index.html` + `data/tasks.json` on GitHub Pages | ✅ Deployed |

---

## Obsidian Vault

- **Location (Mac):** `/Users/saikrithic/Library/CloudStorage/OneDrive-Personal/Orbis Vault`
- **Synced via:** Personal OneDrive (saikrithic62009@gmail.com Microsoft account)
- **Tablet sync:** Remotely Save plugin → OneDrive personal → Remote Base Dir: `Orbis Vault`
  - ⚠️ School MDM on the tablet blocks school OneDrive OAuth — must use personal Microsoft account
- **Plugins enabled:** Dataview, Calendar, Spaced Repetition, Excalidraw, Remotely Save

### Folder Structure

```
Orbis Vault/
├── 00 - Inbox/
├── 01 - Daily Notes/        YYYY-MM-DD format, template: Templates/Daily Note
├── 02 - Subjects/           One folder per subject
│   ├── Maths AI HL/
│   │   ├── Maths AI HL.md   Hub page
│   │   ├── Topics/          5 topic files (all fully written)
│   │   └── Flashcards/
│   ├── Chemistry SL/
│   │   ├── Topics/          9 topic files (all fully written)
│   │   └── Flashcards/
│   ├── Business Management HL/
│   │   ├── Topics/          Unit 1 + Unit 3 fully written (G11 scope)
│   │   └── ...
│   ├── Computer Science HL/
│   ├── English Lang & Lit SL/
│   │   └── Topics/          3 area files (all fully written)
│   └── Spanish Ab Initio/
│       └── Topics/          3 theme files
├── 03 - IB Core/            TOK, EE, CAS
├── 04 - G11 Finals/         Revision pages + timetable (exam: 21 May – 5 June 2026)
├── 05 - Resources/
├── 06 - Handwritten Notes/  Samsung Notes exports go here
└── Templates/               8 templates including Daily Note, Handwritten Note Link
```

### G11 Finals — Exam Timetable

| Date | Subject | Papers |
|---|---|---|
| 21 May (Thu) | Maths AI HL | P1 8:15–10:15 · P2 11:00–13:00 |
| 22 May (Fri) | Maths AI HL | P3 8:15–9:30 |
| 25 May (Mon) | Business Management HL | P1 8:15–9:45 · P2 10:30–12:15 |
| 1 Jun (Mon) | English Lang & Lit SL | P1 8:15–9:30 · P2 10:15–12:00 |
| 3 Jun (Wed) | Computer Science HL | P1 8:15–9:40 · P2 10:15–11:40 |
| 4 Jun (Thu) | Chemistry SL | P1 8:15–9:45 · P2 11:00–12:30 |
| 5 Jun (Fri) | Spanish Ab Initio | Listening 8:15 · Reading 9:45 · Writing 11:30 |

---

## Notion

- **Workspace:** Sai Krithic A's Space
- **Root page ID:** `34a483ac69ec8051a6b8f3c2962056bf`
- **API token:** stored in `~/Documents/Orbis/.env` as `NOTION_API_TOKEN` (gitignored — never commit)

### Tasks Database

- **ID:** `34a483ac-69ec-811b-ab6d-f4bdb283f187`
- **Properties:** Name (title) · Due Date (date) · Status (select) · Priority (select) · Type (select)
- **Status options:** Not Started · In Progress · Done · Awaiting Score
- **Priority options:** High · Medium · Low
- **Type options:** Formative Assessment · STEAM · Writing Task · SDL · Homework · IA · TOK · EE · Exam

### Subject Page IDs

| Subject | Notion page ID |
|---|---|
| Maths AI HL | `34a483ac-69ec-81cf-ad26-fdf851d67a91` |
| Computer Science HL | `34a483ac-69ec-8157-84d0-e0260df8e048` |
| Business Management HL | `34a483ac-69ec-81fb-8be8-f744ddedb7fc` |
| Spanish Ab Initio | `34a483ac-69ec-81ca-89be-db12c723be47` |
| Chemistry SL | `34a483ac-69ec-815e-856d-c81ccb84443b` |
| English Lang & Lit SL | `34a483ac-69ec-81a3-9599-f2c118afcdc7` |

---

## Gmail → Notion Sync

- **Script:** `scripts/gmail_to_notion.gs` deployed to Google Apps Script as "Orbis Gmail Sync"
- **Status:** ✅ Live — runs every 30 minutes automatically
- **Filters:** `@indusschool.com` + `noreply@toddleapp.com`
- **Label:** `orbis-synced` applied to processed threads
- **Last confirmed working:** 2026-05-07

---

## Git Repo

- **Repo:** `sai-k27-0/orbis`
- **Dev branch:** `claude/orbis-development-KR5mm`
- **Rule:** Never push to `main` without Sai's explicit permission

---

## Pending / Not Yet Done

| Item | Notes |
|---|---|
| Remotely Save tablet setup | Obsidian + Remotely Save installed on Tab S10 FE. Need to auth with personal Microsoft account (saikrithic62009@gmail.com), set Remote Base Dir = `Orbis Vault`, Run Once |
| English Finals — Works Studied | Table in `04 - G11 Finals/English Lang & Lit SL — G11 Finals.md` is blank — needs actual texts studied in class |
| CAS Tracker (Notion) | 0 rows — needs actual CAS activities added |
| Samsung Notes → Obsidian sync | Notes go to `06 - Handwritten Notes/` — manual export for now |

---

## Working Style

- Prefers Claude to just do things rather than explain and ask
- Short responses
- Likes interactive step-by-step with screenshots for UI tasks
