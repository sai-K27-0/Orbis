# Orbis — Local Setup Guide

Follow this top to bottom on a fresh machine. Each section is independent — skip any you've already done.

---

## 1. Clone the repo

```bash
git clone https://github.com/sai-k27-0/Orbis.git
cd Orbis
```

If you already have it cloned, pull the latest:

```bash
git pull origin main
```

---

## 2. Set up Obsidian vault

### 2a. Copy the vault folder

Copy the `vault/` folder from the repo to wherever you want to keep your notes. Recommended: put it inside your OneDrive so it syncs across devices.

```
OneDrive/
└── Orbis Vault/          ← copy vault/ contents here
    ├── Home.md
    ├── 00 - Inbox/
    ├── 01 - Daily Notes/
    ├── 02 - Subjects/
    ├── 03 - IB Core/
    ├── 04 - G11 Finals/
    ├── 05 - Resources/
    └── Templates/
```

### 2b. Open in Obsidian

1. Download Obsidian from [obsidian.md](https://obsidian.md) if you haven't already
2. Open Obsidian → **Open folder as vault** → select your vault folder
3. Set `Home.md` as your startup file: Settings → **Appearance** → set "Default view" open file to `Home`

### 2c. Install community plugins

Go to Settings → Community plugins → turn off **Safe mode** → Browse, then install and enable each:

| Plugin | Search for | Purpose |
|---|---|---|
| **Dataview** | `dataview` | Powers the live queries on the Home dashboard |
| **Calendar** | `calendar` | Sidebar calendar for daily notes |
| **Spaced Repetition** | `spaced repetition` | Flashcard review for exam revision |

### 2d. Verify daily notes

Settings → Core plugins → **Daily notes** should be enabled with:
- **Date format:** `YYYY-MM-DD`
- **New file location:** `01 - Daily Notes`
- **Template file:** `Templates/Daily Note`

### 2e. Verify templates

Settings → Core plugins → **Templates** → Template folder location: `Templates`

---

## 3. Set up Notion API token

The Notion workspace is already built. You just need the token to run scripts.

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **orbis** → copy the token
3. Create a `.env` file in the repo root (never commit this):

```bash
echo "NOTION_API_TOKEN=your_token_here" > .env
```

Or export it in your shell:

```bash
export NOTION_API_TOKEN=your_token_here
```

---

## 4. Gmail → Notion automation

### 4a. Deploy the script

1. Go to [script.google.com](https://script.google.com) → **New project**
2. Delete the default `Code.gs` content
3. Copy the full contents of `scripts/gmail_to_notion.gs` and paste it in
4. On line 17, replace `'YOUR_NOTION_API_TOKEN_HERE'` with your actual Notion token
5. Save the project (name it "Orbis Gmail Sync" or similar)

### 4b. First run

1. Click **Run** → select function `setup` → click Run
2. Approve all permissions when prompted (Gmail + external URLs)
3. Check the Logs (View → Logs) — you should see: `Label created: orbis-synced`

### 4c. Schedule automatic runs

1. Click **Run** → select function `createTimeTrigger` → click Run
2. Check Logs — you should see: `Trigger created — runSync will run every 30 minutes`

### 4d. Add your school sender address

Forward a Toddle notification email to your Gmail, then:
1. Check who sent it (the `From:` field)
2. Open `gmail_to_notion.gs` in Apps Script
3. Find `ALLOWED_SENDERS` and add the address:

```js
ALLOWED_SENDERS: [
  'noreply@toddleapp.com',   // or whatever the real address is
  '@yourschool.edu',          // catches any email from school domain
],
```

4. Save and run `runSync` once manually to test

---

## 5. Verify everything works

| Check | How |
|---|---|
| Obsidian vault opens | Home.md loads, Dataview queries show (may be empty initially) |
| Daily note creates | Click calendar icon or Ctrl+P → "Daily note" |
| Templates work | Open any note → Ctrl+P → "Insert template" |
| Gmail script runs | Apps Script → Run → `runSync` → check Logs for "Threads to process" |
| Notion Tasks visible | Open Notion → Tasks database → 55 tasks present |

---

## 6. Day-to-day workflow

```
Morning:
  Obsidian → Ctrl+P → Daily note → check what's due, plan the day

During class:
  Obsidian → 02 - Subjects → [Subject] → Topics → new note → Insert template "Class Note"

Before an FA:
  Obsidian → 02 - Subjects → [Subject] → FA Prep → new note → Insert template "FA Prep"

Task arrives by email:
  Gmail automation picks it up within 30 min → appears in Notion Tasks automatically

IB Core work:
  EE draft → 03 - IB Core → EE → EE — Business Management.md
  TOK journal → 03 - IB Core → TOK → Insert template "TOK Journal"
  CAS log → 03 - IB Core → CAS → Insert template "CAS Log"
```

---

## Environment summary

| Item | Value |
|---|---|
| Repo | `https://github.com/sai-k27-0/Orbis` |
| Dev branch | `claude/orbis-development-KR5mm` |
| Notion root page | `34a483ac69ec8051a6b8f3c2962056bf` |
| Notion Tasks DB | `34a483ac-69ec-811b-ab6d-f4bdb283f187` |
| GitHub Pages | `https://sai-k27-0.github.io/Orbis` |
