/**
 * Orbis — Gmail → Notion Task Automator
 *
 * Scans Gmail for school assignment emails (Toddle, Outlook forwards,
 * teacher emails) and creates tasks in the Notion Tasks database.
 *
 * SETUP:
 *   1. Go to script.google.com → New project → paste this file
 *   2. Fill in CONFIG below
 *   3. Run setup() once to create the Gmail label and authorize
 *   4. Run createTimeTrigger() once to schedule automatic runs
 */

// ── CONFIG ────────────────────────────────────────────────────────────────────

const CONFIG = {
  NOTION_TOKEN:   'YOUR_NOTION_API_TOKEN_HERE',  // paste your token from .env
  TASKS_DB_ID:    '34a483ac-69ec-811b-ab6d-f4bdb283f187',

  // Notion subject page IDs (relation targets)
  SUBJECTS: {
    'maths':    '34a483ac-69ec-81cf-ad26-fdf851d67a91',
    'math':     '34a483ac-69ec-81cf-ad26-fdf851d67a91',
    'cs':       '34a483ac-69ec-8157-84d0-e0260df8e048',
    'computer': '34a483ac-69ec-8157-84d0-e0260df8e048',
    'bm':       '34a483ac-69ec-81fb-8be8-f744ddedb7fc',
    'business': '34a483ac-69ec-81fb-8be8-f744ddedb7fc',
    'spanish':  '34a483ac-69ec-81ca-89be-db12c723be47',
    'chem':     '34a483ac-69ec-815e-856d-c81ccb84443b',
    'english':  '34a483ac-69ec-81a3-9599-f2c118afcdc7',
    'eng':      '34a483ac-69ec-81a3-9599-f2c118afcdc7',
  },

  // Gmail label applied to processed emails so they aren't duplicated
  PROCESSED_LABEL: 'orbis-synced',

  // Only process emails from these senders (add your school domain)
  // Leave empty [] to process all unread emails (not recommended)
  ALLOWED_SENDERS: [
    // 'noreply@toddleapp.com',   // uncomment once you see the real sender
    // '@yourschool.edu',          // match any email from school domain
  ],

  // Process emails with these terms in subject (case-insensitive)
  SUBJECT_KEYWORDS: [
    'assignment', 'task', 'due', 'submission', 'homework',
    'toddle', 'formative', 'assessment', 'fa', 'ia', 'tok',
  ],

  // How many days to look back on first run (after that only unread)
  LOOKBACK_DAYS: 7,
};

// ── MAIN ──────────────────────────────────────────────────────────────────────

function runSync() {
  const label      = getOrCreateLabel(CONFIG.PROCESSED_LABEL);
  const threads    = fetchUnprocessedThreads(label);

  Logger.log('Threads to process: ' + threads.length);

  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      if (msg.isUnread() || !msg.getThread().getLabels().includes(label)) {
        const task = parseEmail(msg);
        if (task) {
          const created = createNotionTask(task);
          if (created) {
            Logger.log('Created task: ' + task.name);
          }
        }
      }
    });
    // Mark thread as processed
    thread.addLabel(label);
  });
}

// ── EMAIL FETCHING ────────────────────────────────────────────────────────────

function fetchUnprocessedThreads(processedLabel) {
  let query = '-label:' + CONFIG.PROCESSED_LABEL + ' is:unread';

  // Filter by sender if configured
  if (CONFIG.ALLOWED_SENDERS.length > 0) {
    const from = CONFIG.ALLOWED_SENDERS.map(s => 'from:' + s).join(' OR ');
    query += ' (' + from + ')';
  }

  // Filter by subject keywords
  if (CONFIG.SUBJECT_KEYWORDS.length > 0) {
    const subj = CONFIG.SUBJECT_KEYWORDS.map(k => 'subject:' + k).join(' OR ');
    query += ' (' + subj + ')';
  }

  // Date range
  const since = new Date();
  since.setDate(since.getDate() - CONFIG.LOOKBACK_DAYS);
  query += ' after:' + Utilities.formatDate(since, 'UTC', 'yyyy/MM/dd');

  Logger.log('Gmail query: ' + query);
  return GmailApp.search(query, 0, 50);
}

// ── EMAIL PARSER ──────────────────────────────────────────────────────────────

function parseEmail(msg) {
  const subject = msg.getSubject();
  const body    = msg.getPlainBody();
  const from    = msg.getFrom();
  const date    = msg.getDate();

  // Skip if not relevant
  const lSubject = subject.toLowerCase();
  const lBody    = body.toLowerCase();
  const combined = lSubject + ' ' + lBody;

  // Determine source
  const source = detectSource(from, subject, body);

  // Extract task name — prefer subject line, clean it up
  let name = cleanSubject(subject, source);
  if (!name || name.length < 3) return null;

  // Extract due date
  const due = extractDueDate(body, date);

  // Detect subject
  const subjectId = detectSubject(combined);

  // Detect task type
  const type = detectType(combined);

  // Detect priority
  const priority = detectPriority(combined);

  return { name, due, subjectId, type, priority, source, rawSubject: subject };
}

function detectSource(from, subject, body) {
  if (from.includes('toddle') || body.includes('toddle') || body.includes('toddleapp')) return 'Toddle';
  if (from.includes('outlook') || from.includes('microsoft')) return 'Outlook';
  if (body.includes('google classroom')) return 'Classroom';
  return 'Email';
}

function cleanSubject(subject, source) {
  return subject
    .replace(/^(fwd?|fw|re):\s*/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/toddle|outlook|notification|reminder|new assignment/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDueDate(body, fallback) {
  // Common date patterns
  const patterns = [
    /due\s+(?:on\s+)?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /due\s+(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i,
    /deadline[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /submit(?:ted)?\s+by\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})/i,
  ];

  for (const pat of patterns) {
    const m = body.match(pat);
    if (m) {
      try {
        const d = new Date(m[1] || m[0]);
        if (!isNaN(d)) return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
      } catch(e) {}
    }
  }
  return null;
}

function detectSubject(text) {
  const map = {
    'maths ai|maths|mathematics|math':        CONFIG.SUBJECTS['maths'],
    'computer science|cs hl|\\bcs\\b':         CONFIG.SUBJECTS['cs'],
    'business management|business|\\bbm\\b':   CONFIG.SUBJECTS['bm'],
    'spanish|ab initio|español':               CONFIG.SUBJECTS['spanish'],
    'chemistry|chem':                          CONFIG.SUBJECTS['chem'],
    'english|lang.*lit|literature':            CONFIG.SUBJECTS['english'],
  };
  for (const [pattern, id] of Object.entries(map)) {
    if (new RegExp(pattern, 'i').test(text)) return id;
  }
  return null;
}

function detectType(text) {
  if (/\bfa\b|formative\s*assessment/.test(text))      return 'FA';
  if (/\bia\b|internal\s*assessment/.test(text))       return 'IA';
  if (/\btok\b|theory\s*of\s*knowledge/.test(text))    return 'TOK';
  if (/\bee\b|extended\s*essay/.test(text))            return 'EE';
  if (/\bwt\b|writing\s*task/.test(text))              return 'WT';
  if (/\bsteam\b/.test(text))                          return 'STEAM';
  if (/\bhye\b|half.year|mid.?term/.test(text))        return 'HYE';
  if (/\bhomework\b|\bhw\b/.test(text))                return 'HW';
  return 'SDL';
}

function detectPriority(text) {
  if (/urgent|asap|immediately|high\s*priority/.test(text)) return 'High';
  if (/\bfa\b|formative|submission|due\s+tomorrow/.test(text)) return 'High';
  return 'Medium';
}

// ── NOTION API ────────────────────────────────────────────────────────────────

function createNotionTask(task) {
  const props = {
    'Task':     { title: [{ text: { content: task.name } }] },
    'Type':     { select: { name: task.type } },
    'Status':   { select: { name: 'To Do' } },
    'Priority': { select: { name: task.priority } },
    'Done':     { checkbox: false },
    'Source':   { select: { name: task.source } },
  };

  if (task.due) {
    props['Due Date'] = { date: { start: task.due } };
  }

  if (task.subjectId) {
    props['Subject'] = { relation: [{ id: task.subjectId }] };
  }

  const payload = JSON.stringify({
    parent:     { database_id: CONFIG.TASKS_DB_ID },
    properties: props,
  });

  const response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method:  'post',
    headers: {
      'Authorization':  'Bearer ' + CONFIG.NOTION_TOKEN,
      'Notion-Version': '2022-06-28',
      'Content-Type':   'application/json',
    },
    payload:            payload,
    muteHttpExceptions: true,
  });

  const result = JSON.parse(response.getContentText());
  if (result.object === 'error') {
    Logger.log('Notion error: ' + result.message);
    return false;
  }
  return true;
}

// ── UTILITIES ─────────────────────────────────────────────────────────────────

function getOrCreateLabel(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) label = GmailApp.createLabel(name);
  return label;
}

// ── ONE-TIME SETUP ────────────────────────────────────────────────────────────

/** Run this once manually to authorise Gmail + Notion access */
function setup() {
  getOrCreateLabel(CONFIG.PROCESSED_LABEL);
  Logger.log('Label created: ' + CONFIG.PROCESSED_LABEL);
  Logger.log('Setup complete. Now run createTimeTrigger().');
}

/** Run this once to schedule automatic syncs every 30 minutes */
function createTimeTrigger() {
  // Remove existing triggers first
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'runSync') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runSync')
    .timeBased()
    .everyMinutes(30)
    .create();
  Logger.log('Trigger created — runSync will run every 30 minutes.');
}
