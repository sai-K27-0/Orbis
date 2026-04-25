"""
Orbis Notion Builder
Builds Subjects, Tasks, IA Tracker databases + TOK & EE page
inside the root Orbis page.
"""
import json, time, sys, os, requests

TOKEN   = os.environ["NOTION_API_TOKEN"]
ROOT    = "34a483ac69ec8051a6b8f3c2962056bf"
BASE    = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)

def req(method, endpoint, data=None):
    url = f"{BASE}/{endpoint}"
    for attempt in range(5):
        try:
            r = SESSION.request(method.upper(), url, json=data)
            if r.status_code == 503 or not r.content:
                wait = 2 ** attempt
                print(f"  503/empty — retry in {wait}s…", file=sys.stderr)
                time.sleep(wait)
                continue
            d = r.json()
            if d.get("object") == "error":
                print(f"  ERROR [{endpoint}]: {d.get('message')}", file=sys.stderr)
            return d
        except Exception as e:
            wait = 2 ** attempt
            print(f"  Exception ({e}) — retry in {wait}s…", file=sys.stderr)
            time.sleep(wait)
    print(f"  FAILED after 5 attempts: {endpoint}", file=sys.stderr)
    return {"object": "error", "message": "max retries exceeded"}

def db(parent_id, title, emoji, properties):
    return req("post", "databases", {
        "parent":     {"type": "page_id", "page_id": parent_id},
        "icon":       {"type": "emoji", "emoji": emoji},
        "title":      [{"type": "text", "text": {"content": title}}],
        "properties": properties,
    })

def row(database_id, props, icon=None):
    body = {"parent": {"database_id": database_id}, "properties": props}
    if icon:
        body["icon"] = {"type": "emoji", "emoji": icon}
    r = req("post", "pages", body)
    time.sleep(0.4)
    return r

def title_prop(text):
    return {"title": [{"text": {"content": text}}]}

def rt(text):
    return {"rich_text": [{"text": {"content": text}}]}

def sel(name):
    return {"select": {"name": name}}

# ── 1. SUBJECTS ───────────────────────────────────────────────────────────────

print("Creating Subjects database…")
subjects_db = db(ROOT, "Subjects", "📚", {
    "Subject":      {"title": {}},
    "Level":        {"select": {"options": [
                        {"name": "HL",       "color": "red"},
                        {"name": "SL",       "color": "blue"},
                        {"name": "Ab Initio","color": "green"},
                    ]}},
    "IA Format":    {"rich_text": {}},
    "IA Weight %":  {"number": {"format": "number"}},
    "Grade Target": {"number": {"format": "number"}},
    "Current Grade":{"number": {"format": "number"}},
    "Topics":       {"rich_text": {}},
})
if subjects_db.get("object") == "error":
    sys.exit(1)
SDB = subjects_db["id"]
print(f"  ✓ Subjects DB: {SDB}")

SUBJECTS = [
    {"key":"ma","name":"Maths AI HL",             "level":"HL",
     "ia":"Mathematical Investigation (12–20 pages)","w":20,
     "topics":"Topics 1–5"},
    {"key":"cs","name":"Computer Science HL",      "level":"HL",
     "ia":"Project — 5-part solution (max 2,000 words + 2–7 min video)","w":20,
     "topics":"Core + Option"},
    {"key":"bm","name":"Business Management HL",   "level":"HL",
     "ia":"Research Project (max 1,800 words)","w":20,
     "topics":"Units 1–5"},
    {"key":"sp","name":"Spanish Ab Initio",        "level":"Ab Initio",
     "ia":"Individual Oral — 7–10 min (15 min prep)","w":25,
     "topics":"5 Themes"},
    {"key":"ch","name":"Chemistry SL",             "level":"SL",
     "ia":"Scientific Investigation (max 3,000 words)","w":20,
     "topics":"Topics 1–11"},
    {"key":"en","name":"English Lang & Lit SL",    "level":"SL",
     "ia":"Individual Oral — 10 min + 5 min Q&A","w":30,
     "topics":"2 Works (1 original language, 1 translation)"},
]

subj_ids = {}
for s in SUBJECTS:
    r = row(SDB, {
        "Subject":      title_prop(s["name"]),
        "Level":        sel(s["level"]),
        "IA Format":    rt(s["ia"]),
        "IA Weight %":  {"number": s["w"]},
        "Grade Target": {"number": 7},
        "Topics":       rt(s["topics"]),
    })
    subj_ids[s["key"]] = r["id"]
    print(f"  ✓ {s['name']}")

# ── 2. TASKS ─────────────────────────────────────────────────────────────────

print("\nCreating Tasks database…")
tasks_db = db(ROOT, "Tasks", "✅", {
    "Task":     {"title": {}},
    "Subject":  {"relation": {"database_id": SDB, "single_property": {}}},
    "Type":     {"select": {"options": [
                    {"name":"FA",    "color":"red"},
                    {"name":"STEAM", "color":"blue"},
                    {"name":"WT",    "color":"purple"},
                    {"name":"SDL",   "color":"green"},
                    {"name":"HW",    "color":"yellow"},
                    {"name":"IA",    "color":"orange"},
                    {"name":"TOK",   "color":"default"},
                    {"name":"EE",    "color":"pink"},
                ]}},
    "Due Date": {"date": {}},
    "Status":   {"select": {"options": [
                    {"name":"Not Started",   "color":"gray"},
                    {"name":"In Progress",   "color":"yellow"},
                    {"name":"Done",          "color":"green"},
                    {"name":"Awaiting Score","color":"orange"},
                ]}},
    "Done":     {"checkbox": {}},
    "Source":   {"select": {"options": [
                    {"name":"Obsidian","color":"purple"},
                    {"name":"Local",   "color":"gray"},
                ]}},
})
if tasks_db.get("object") == "error":
    sys.exit(1)
TDB = tasks_db["id"]
print(f"  ✓ Tasks DB: {TDB}")

SUBJ_MAP = {
    "maths": subj_ids["ma"],
    "cs":    subj_ids["cs"],
    "bm":    subj_ids["bm"],
    "sp":    subj_ids["sp"],
    "ch":    subj_ids["ch"],
    "en":    subj_ids["en"],
}
TYPE_MAP = {
    "fa":"FA","steam":"STEAM","wt":"WT","sdl":"SDL",
    "hw":"HW","ia":"IA","tok":"TOK","ee":"EE",
}

with open(os.path.join(os.path.dirname(__file__), "../data/tasks.json")) as f:
    raw_tasks = json.load(f)["tasks"]

for i, t in enumerate(raw_tasks, 1):
    name  = t["name"]
    await_score = "[awaiting_score]" in name.lower()
    clean = name.replace("   [awaiting_score]","").replace(" [awaiting_score]","").strip()
    status = "Awaiting Score" if await_score else ("Done" if t["done"] else "Not Started")

    props = {
        "Task":   title_prop(clean),
        "Type":   sel(TYPE_MAP.get(t["type"], t["type"].upper())),
        "Status": sel(status),
        "Done":   {"checkbox": bool(t["done"])},
        "Source": sel((t.get("source") or "local").capitalize()),
    }
    if t.get("due"):
        props["Due Date"] = {"date": {"start": t["due"]}}
    sk = t.get("subject","")
    if sk in SUBJ_MAP:
        props["Subject"] = {"relation": [{"id": SUBJ_MAP[sk]}]}

    r = row(TDB, props)
    print(f"  ✓ [{i:02d}/{len(raw_tasks)}] {clean[:55]}")

# ── 3. IA TRACKER ─────────────────────────────────────────────────────────────

print("\nCreating IA Tracker database…")
ia_db = db(ROOT, "IA Tracker", "🔬", {
    "IA":               {"title": {}},
    "Subject":          {"relation": {"database_id": SDB, "single_property": {}}},
    "Format":           {"rich_text": {}},
    "Weight %":         {"number": {"format": "number"}},
    "Word / Time Limit":{"rich_text": {}},
    "Status":           {"select": {"options": [
                            {"name":"Not Started","color":"gray"},
                            {"name":"Planning",   "color":"yellow"},
                            {"name":"Drafting",   "color":"blue"},
                            {"name":"Reviewing",  "color":"orange"},
                            {"name":"Submitted",  "color":"green"},
                            {"name":"Marked",     "color":"purple"},
                        ]}},
    "Score":            {"number": {"format": "number"}},
    "Out Of":           {"number": {"format": "number"}},
    "Notes":            {"rich_text": {}},
})
if ia_db.get("object") == "error":
    sys.exit(1)
IDB = ia_db["id"]
print(f"  ✓ IA Tracker DB: {IDB}")

IA_ROWS = [
    {"name":"Maths AI HL — Mathematical Investigation",
     "key":"ma","format":"Mathematical Investigation",
     "w":20,"limit":"12–20 pages","out_of":20},
    {"name":"Computer Science HL — Project",
     "key":"cs","format":"Project (5-part solution)",
     "w":20,"limit":"Max 2,000 words + 2–7 min video demo","out_of":34},
    {"name":"Business Management HL — Research Project",
     "key":"bm","format":"Research Project",
     "w":20,"limit":"Max 1,800 words","out_of":25},
    {"name":"Spanish Ab Initio — Individual Oral",
     "key":"sp","format":"Individual Oral",
     "w":25,"limit":"7–10 min (15 min prep, max 10 bullet notes)","out_of":30},
    {"name":"Chemistry SL — Scientific Investigation",
     "key":"ch","format":"Scientific Investigation",
     "w":20,"limit":"Max 3,000 words","out_of":24},
    {"name":"English Lang & Lit SL — Individual Oral",
     "key":"en","format":"Individual Oral",
     "w":30,"limit":"10 min presentation + 5 min Q&A","out_of":40},
]

for e in IA_ROWS:
    row(IDB, {
        "IA":               title_prop(e["name"]),
        "Subject":          {"relation": [{"id": subj_ids[e["key"]]}]},
        "Format":           rt(e["format"]),
        "Weight %":         {"number": e["w"]},
        "Word / Time Limit":rt(e["limit"]),
        "Status":           sel("Not Started"),
        "Out Of":           {"number": e["out_of"]},
    })
    print(f"  ✓ {e['name'][:60]}")

# ── 4. TOK & EE PAGE ─────────────────────────────────────────────────────────

print("\nCreating TOK & EE page…")

def h1(text, color="default"):
    return {"object":"block","type":"heading_1","heading_1":{
        "rich_text":[{"type":"text","text":{"content":text}}],"color":color}}

def h2(text):
    return {"object":"block","type":"heading_2","heading_2":{
        "rich_text":[{"type":"text","text":{"content":text}}]}}

def callout(text, emoji, color):
    return {"object":"block","type":"callout","callout":{
        "rich_text":[{"type":"text","text":{"content":text}}],
        "icon":{"type":"emoji","emoji":emoji},"color":color}}

def bullet(text):
    return {"object":"block","type":"bulleted_list_item","bulleted_list_item":{
        "rich_text":[{"type":"text","text":{"content":text}}]}}

def divider():
    return {"object":"block","type":"divider","divider":{}}

tok_ee = req("post", "pages", {
    "parent": {"type":"page_id","page_id":ROOT},
    "icon":   {"type":"emoji","emoji":"🎓"},
    "properties": {"title":[{"type":"text","text":{"content":"TOK & EE"}}]},
    "children": [
        # ── TOK ──
        h1("Theory of Knowledge (TOK)", "teal_background"),
        callout(
            "TOK is assessed via two components. Essay = external exam (A–E). "
            "Exhibition = internal assessment (A–E). Both grades combine for your TOK score "
            "which contributes to IB bonus points (with EE grade).",
            "💡","teal_background"
        ),
        h2("TOK Essay"),
        bullet("Word count: 0 / 1,600 words max  (aim for 1,300–1,500)"),
        bullet("Prescribed title: [add your chosen title]"),
        bullet("Draft deadline: —"),
        bullet("Final submission: —"),
        bullet("Grade: —"),
        h2("TOK Exhibition"),
        bullet("Total commentary: 0 / 950 words  (3 objects × ~300 words each)"),
        bullet("IA prompt: [add your chosen prompt from the 35 official prompts]"),
        bullet("Object 1: — | Commentary: 0 words"),
        bullet("Object 2: — | Commentary: 0 words"),
        bullet("Object 3: — | Commentary: 0 words"),
        bullet("Grade: —"),
        divider(),
        # ── EE ──
        h1("Extended Essay (EE)", "purple_background"),
        callout(
            "Your EE is in Business Management HL. Max 4,000 words. "
            "Graded A–E (minimum D required for IB Diploma). "
            "Marked out of 34 across 5 criteria. Counts toward bonus points matrix with TOK.",
            "📝","purple_background"
        ),
        bullet("Subject: Business Management HL"),
        bullet("Word count: 0 / 4,000 words"),
        bullet("Research question: [add your RQ]"),
        bullet("Supervisor: [name]"),
        bullet("First reflection (Researcher's Reflection Space — RRS): —"),
        bullet("Interim reflection: —"),
        bullet("Final reflection (viva voce): —"),
        bullet("Grade: —"),
        h2("EE Criteria (marked out of 34)"),
        bullet("A — Focus and method        /6"),
        bullet("B — Knowledge and understanding  /6"),
        bullet("C — Critical thinking       /12"),
        bullet("D — Presentation            /4"),
        bullet("E — Engagement              /6"),
        divider(),
        h2("TOK + EE Bonus Points Matrix"),
        callout(
            "EE grade (rows A→E) × TOK grade (cols A→E) → bonus points added to total.\n"
            "A/A = 3 pts  |  A/B or B/A = 3 pts  |  A/C or C/A = 2 pts  |  "
            "B/B = 3 pts  |  B/C = 2 pts  |  C/C = 1 pt  |  E in either = 0 pts (diploma at risk)",
            "🎲","gray_background"
        ),
    ],
})
print(f"  ✓ TOK & EE page: {tok_ee.get('id')}")

# ── SUMMARY ───────────────────────────────────────────────────────────────────

print("\n" + "="*50)
print("ORBIS NOTION BUILD COMPLETE")
print("="*50)
print(f"📚 Subjects DB  : https://notion.so/{SDB.replace('-','')}")
print(f"✅ Tasks DB     : https://notion.so/{TDB.replace('-','')}")
print(f"🔬 IA Tracker   : https://notion.so/{IDB.replace('-','')}")
print(f"🎓 TOK & EE     : https://notion.so/{tok_ee.get('id','').replace('-','')}")
