// Orbis — Gmail → Notion + Obsidian Sync
// Watches Gmail for school emails, creates tasks in Notion AND notes in Obsidian vault.

var CONFIG = {
  NOTION_API_TOKEN: PropertiesService.getScriptProperties().getProperty('NOTION_API_TOKEN'),
  NOTION_TASKS_DB: '34a483ac-69ec-811b-ab6d-f4bdb283f187',
  LABEL_NAME: 'orbis-synced',
  OBSIDIAN_VAULT_NAME: 'Orbis Vault',
  OBSIDIAN_INBOX_FOLDER: '00 - Inbox',
  ALLOWED_SENDERS: [
    '@indusschool.com',
    'noreply@toddleapp.com',
  ],
};

function setup() {
  var label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME);
  if (!label) {
    GmailApp.createLabel(CONFIG.LABEL_NAME);
    Logger.log('Label created: ' + CONFIG.LABEL_NAME);
  } else {
    Logger.log('Label already exists: ' + CONFIG.LABEL_NAME);
  }
}

function createTimeTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'runSync') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runSync').timeBased().everyMinutes(30).create();
  Logger.log('Trigger created — runSync every 30 minutes');
}

// ── Main sync ────────────────────────────────────────────────
function runSync() {
  var label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME);
  if (!label) { setup(); label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME); }

  var threads = GmailApp.search('is:unread -label:' + CONFIG.LABEL_NAME, 0, 20);
  Logger.log('Threads to process: ' + threads.length);

  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(msg) {
      if (!msg.isUnread()) return;
      var from = msg.getFrom();
      if (!isAllowedSender(from)) return;

      var subject = msg.getSubject();
      var body    = msg.getPlainBody().substring(0, 800);
      var date    = msg.getDate();

      createNotionTask(subject, body, from, date);
      createObsidianNote(subject, body, from, date);
    });
    thread.addLabel(label);
    thread.markRead();
  });
}

function isAllowedSender(from) {
  return CONFIG.ALLOWED_SENDERS.some(function(s) {
    return from.toLowerCase().indexOf(s.toLowerCase()) !== -1;
  });
}

// ── Notion ───────────────────────────────────────────────────
function createNotionTask(subject, body, from, date) {
  var dueDate = extractDueDate(body) || Utilities.formatDate(
    new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
    Session.getScriptTimeZone(), 'yyyy-MM-dd'
  );

  var payload = {
    parent: { database_id: CONFIG.NOTION_TASKS_DB },
    properties: {
      'Task':     { title: [{ text: { content: subject } }] },
      'Status':   { select: { name: 'Not Started' } },
      'Due Date': { date: { start: dueDate } },
      'Source':   { select: { name: 'Gmail' } },
      'Priority': { select: { name: 'Medium' } }
    }
  };

  var response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.NOTION_API_TOKEN,
      'Notion-Version': '2022-06-28',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  Logger.log('Notion ' + response.getResponseCode() + ': ' + subject);
}

// ── Obsidian (Google Drive) ───────────────────────────────────
function getObsidianInboxFolder() {
  var vaultFolders = DriveApp.getFoldersByName(CONFIG.OBSIDIAN_VAULT_NAME);
  if (!vaultFolders.hasNext()) {
    Logger.log('ERROR: Orbis Vault not found in Google Drive');
    return null;
  }
  var vault = vaultFolders.next();
  var inboxFolders = vault.getFoldersByName(CONFIG.OBSIDIAN_INBOX_FOLDER);
  if (!inboxFolders.hasNext()) {
    Logger.log('ERROR: 00 - Inbox not found in vault');
    return null;
  }
  return inboxFolders.next();
}

function createObsidianNote(subject, body, from, date) {
  var inbox = getObsidianInboxFolder();
  if (!inbox) return;

  var dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var timeStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm');
  var safeSubject = subject.replace(/[\/\\:*?"<>|]/g, '-').substring(0, 60);
  var fileName = dateStr + ' — ' + safeSubject + '.md';

  // Check if note already exists
  var existing = inbox.getFilesByName(fileName);
  if (existing.hasNext()) {
    Logger.log('Note already exists, skipping: ' + fileName);
    return;
  }

  var senderClean = from.replace(/<.*>/, '').trim();
  var content = [
    '# ' + subject,
    '',
    '**From:** ' + senderClean,
    '**Date:** ' + dateStr + ' ' + timeStr,
    '**Source:** Gmail → Orbis',
    '',
    '---',
    '',
    '## Content',
    '',
    body,
    '',
    '---',
    '',
    '## Action',
    '',
    '- [ ] ',
    '',
    '**Notion task:** Created automatically',
  ].join('\n');

  inbox.createFile(fileName, content, MimeType.PLAIN_TEXT);
  Logger.log('Obsidian note created: ' + fileName);
}

// ── Helpers ──────────────────────────────────────────────────
function extractDueDate(body) {
  var isoMatch = body.match(/due[:\s]+(\d{4}-\d{2}-\d{2})/i);
  if (isoMatch) return isoMatch[1];
  return null;
}
