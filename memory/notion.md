# Orbis Memory — Notion

## Workspace
- **Name:** Sai Krithic A's Space
- **Root page ID:** `34a483ac69ec8051a6b8f3c2962056bf`
- **API token:** in `~/Documents/Orbis/.env` → env var `NOTION_API_TOKEN` (never commit)

## Tasks Database
- **ID:** `34a483ac-69ec-811b-ab6d-f4bdb283f187`

### Properties
| Property | Type | Options |
|---|---|---|
| Name | Title | — |
| Due Date | Date | — |
| Status | Select | Not Started · In Progress · Done · Awaiting Score |
| Priority | Select | High · Medium · Low |
| Type | Select | Formative Assessment · STEAM · Writing Task · SDL · Homework · IA · TOK · EE · Exam |

> Note: `Done` checkbox and `Source` property were removed in a DB overhaul (2026-05). `Task` was renamed to `Name`.

## Subject Pages
| Subject | Notion page ID |
|---|---|
| Maths AI HL | `34a483ac-69ec-81cf-ad26-fdf851d67a91` |
| Computer Science HL | `34a483ac-69ec-8157-84d0-e0260df8e048` |
| Business Management HL | `34a483ac-69ec-81fb-8be8-f744ddedb7fc` |
| Spanish Ab Initio | `34a483ac-69ec-81ca-89be-db12c723be47` |
| Chemistry SL | `34a483ac-69ec-815e-856d-c81ccb84443b` |
| English Lang & Lit SL | `34a483ac-69ec-81a3-9599-f2c118afcdc7` |

## Gmail → Notion Sync
- **Script:** `scripts/gmail_to_notion.gs`
- **Deployed as:** "Orbis Gmail Sync" in Google Apps Script
- **Trigger:** Every 30 minutes (time-based)
- **Filters:** `@indusschool.com` + `noreply@toddleapp.com`
- **Label applied:** `orbis-synced`
- **Status:** ✅ Live and working as of 2026-05-07
