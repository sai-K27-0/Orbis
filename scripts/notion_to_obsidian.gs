// Orbis — Notion Tasks → Obsidian Sync
// Pulls all incomplete tasks from Notion and writes them to the vault as Tasks.md

var CONFIG = {
  NOTION_API_TOKEN: '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',
  NOTION_TASKS_DB: '34a483ac-69ec-811b-ab6d-f4bdb283f187',
  OBSIDIAN_VAULT_NAME: 'Orbis Vault',
  OUTPUT_FILE: 'Tasks — Notion.md',
};

function createNotionSyncTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'syncNotionToObsidian') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncNotionToObsidian').timeBased().everyMinutes(30).create();
  Logger.log('Trigger created — syncNotionToObsidian every 30 minutes');
}

function syncNotionToObsidian() {
  var tasks = fetchNotionTasks();
  if (!tasks) { Logger.log('Failed to fetch tasks'); return; }

  var content = buildMarkdown(tasks);
  writeToVault(content);
}

// ── Fetch from Notion ─────────────────────────────────────────
function fetchNotionTasks() {
  var payload = {
    filter: {
      property: 'Done',
      checkbox: { equals: false }
    },
    sorts: [
      { property: 'Due Date', direction: 'ascending' }
    ]
  };

  var response = UrlFetchApp.fetch(
    'https://api.notion.com/v1/databases/' + CONFIG.NOTION_TASKS_DB + '/query',
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.NOTION_API_TOKEN,
        'Notion-Version': '2022-06-28',
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    }
  );

  if (response.getResponseCode() !== 200) {
    Logger.log('Notion error: ' + response.getContentText());
    return null;
  }

  return JSON.parse(response.getContentText()).results;
}

// ── Build Markdown ────────────────────────────────────────────
function buildMarkdown(tasks) {
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  var lines = [
    '# Tasks — From Notion',
    '',
    '> Auto-synced from Notion · Last updated: ' + now,
    '> Edit tasks in Notion — changes appear here within 30 min.',
    '',
  ];

  // Group by Status
  var groups = { 'In Progress': [], 'Not Started': [], 'Awaiting Score': [] };

  tasks.forEach(function(page) {
    var props = page.properties;
    var title    = props['Task']     && props['Task'].title[0]     ? props['Task'].title[0].plain_text : '(no title)';
    var status   = props['Status']   && props['Status'].select     ? props['Status'].select.name       : 'Not Started';
    var priority = props['Priority'] && props['Priority'].select   ? props['Priority'].select.name     : '';
    var dueDate  = props['Due Date'] && props['Due Date'].date     ? props['Due Date'].date.start       : '';
    var type     = props['Type']     && props['Type'].select       ? props['Type'].select.name         : '';

    var meta = [];
    if (dueDate)  meta.push('📅 ' + dueDate);
    if (type)     meta.push(type);
    if (priority) meta.push(priority);

    var line = '- [ ] **' + title + '**' + (meta.length ? '  ·  ' + meta.join(' · ') : '');

    if (!groups[status]) groups[status] = [];
    groups[status].push(line);
  });

  ['In Progress', 'Not Started', 'Awaiting Score'].forEach(function(status) {
    if (groups[status] && groups[status].length > 0) {
      lines.push('## ' + status);
      lines.push('');
      groups[status].forEach(function(l) { lines.push(l); });
      lines.push('');
    }
  });

  return lines.join('\n');
}

// ── Write to Google Drive (Obsidian vault) ────────────────────
function writeToVault(content) {
  var vaultFolders = DriveApp.getFoldersByName(CONFIG.OBSIDIAN_VAULT_NAME);
  if (!vaultFolders.hasNext()) {
    Logger.log('ERROR: Orbis Vault not found in Google Drive');
    return;
  }
  var vault = vaultFolders.next();

  // Find or create the file
  var files = vault.getFilesByName(CONFIG.OUTPUT_FILE);
  if (files.hasNext()) {
    files.next().setContent(content);
    Logger.log('Tasks.md updated');
  } else {
    vault.createFile(CONFIG.OUTPUT_FILE, content, MimeType.PLAIN_TEXT);
    Logger.log('Tasks.md created');
  }
}
