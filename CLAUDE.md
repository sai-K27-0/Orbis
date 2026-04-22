# Orbis — Claude Context

Orbis is a personal IB Diploma school management and unified knowledge system built for **Sai Krithic A**, Year 1 IB student.

---

## Stack

| Layer | Tool | Status |
|---|---|---|
| Dashboard (PWA) | `index.html` + `data/tasks.json` | Built, 55 tasks, Netlify deleted |
| Notes / source of truth | Obsidian vault in OneDrive (school Microsoft account) | Active |
| Task / knowledge DB | Notion (free tier) | Being built via API |
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

---

## Notion Integration

- **Integration name:** orbis
- **Workspace:** Sai Krithic A's Space
- **API token:** stored in `.env` / passed via environment variable `NOTION_API_TOKEN` (never commit)
- **Root page:** To be created manually as "Orbis" and connected to the integration

### Databases to build inside Notion

1. **Subjects** — one row per subject, stores level, grade target, colour
2. **Tasks** — assignments, FAs, assessments with due dates and subject relation
3. **IB Core tracker** — EE word count, TOK essay + exhibition progress, CAS hours
4. **Sources** — bibliography/resource log linked to subjects

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

1. Notion workspace is empty.
2. Manual step required: create a blank page called **"Orbis"** in Notion, then connect the **orbis** integration via the `...` menu → Add connections → Orbis.
3. Once the page URL is shared here, Claude will build all four databases inside it.
4. After Notion is scaffolded, migrate the 55 tasks from `data/tasks.json` into the Tasks database.
5. Long-term: OneNote content to be migrated into Notion as archive.
