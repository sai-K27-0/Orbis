# Orbis — IB Hub

> A personal school management dashboard for IB Diploma students. Tracks assignments, assessments, IB Core progress, grades, and study time — accessible from any device via browser.

## Features

- **Task manager** — full FA / STEAM / WT / SDL / Homework tracking with colour-coded subjects
- **FA alerts** — Formative Assessments are always surfaced at the top
- **IB Core tracker** — EE word count, TOK essay + exhibition, CAS hours (all three strands)
- **Grade calculator** — predicted 1–7 per subject + EE/TOK bonus point matrix = total out of 45
- **Study timer** — Pomodoro with circular progress ring, session + hour tracking, presets
- **Exam countdown** — live days/hours/minutes/seconds to first exam
- **Quick notes** — auto-saved scratchpad
- **PWA** — installable on Android and iOS as a home screen app (works offline)
- **Responsive** — full sidebar on desktop, bottom nav on mobile (Samsung, iPhone)

## Subjects

| Subject | Level |
|---|---|
| Maths AI | HL |
| Computer Science | HL |
| Business Management | HL |
| Spanish | Ab Initio |
| Chemistry | SL |
| English | SL |

## Assessment types supported

| Code | Name | Notes |
|---|---|---|
| FA | Formative Assessment | Monthly — highest priority |
| STEAM | STEAM Group Task | Collaborative |
| WT | Writing Task | Randomly assigned |
| SDL | Self-Directed Learning | Randomly assigned, frequent |
| HW | Homework | General |

## Deploy

**Netlify (recommended):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `Orbis/` folder onto the page
3. Copy your site URL
4. In your domain registrar, add a CNAME record: `ib` → your Netlify URL
5. In Netlify → Domain settings, add your custom domain `ib.yourdomain.com`

**GitHub Pages (this repo):**
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: `main` branch, `/ (root)`
3. Visit `https://yourusername.github.io/Orbis`

## Install on Android

1. Open the site in Chrome
2. Tap the three-dot menu → "Add to Home screen"
3. Orbis launches like a native app with no browser chrome

## Local development

No build step needed. Just open `index.html` in a browser.

---

*Built for IB Year — May 20XX session*
