// Orbis — Notion Tasks → OneDrive (Obsidian Vault) Sync
// Uses Microsoft Graph API to write directly to OneDrive — no Mac needed

var CONFIG = {
  NOTION_API_TOKEN: PropertiesService.getScriptProperties().getProperty('NOTION_API_TOKEN'),
  NOTION_TASKS_DB: '34a483ac-69ec-811b-ab6d-f4bdb283f187',
  MS_CLIENT_ID: '9fcbad76-5749-4874-863f-a424e8c80014',
  ONEDRIVE_PATH: 'Orbis Vault/Tasks — Notion.md',
  OUTPUT_FILE: 'Tasks — Notion.md',
};

// ── Trigger Setup ─────────────────────────────────────────────
function createNotionSyncTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'syncNotionToObsidian') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncNotionToObsidian').timeBased().everyMinutes(30).create();
  Logger.log('Trigger created — syncNotionToObsidian every 30 minutes');
}

// ── Main Sync ─────────────────────────────────────────────────
function syncNotionToObsidian() {
  var tasks = fetchNotionTasks();
  if (!tasks) { Logger.log('Failed to fetch tasks'); return; }
  var content = buildMarkdown(tasks);
  writeToOneDrive(content);
}

// ── Microsoft Graph: Get Access Token ────────────────────────
function getMSAccessToken() {
  var props = PropertiesService.getScriptProperties();
  var refreshToken = props.getProperty('MS_REFRESH_TOKEN');
  if (!refreshToken) { Logger.log('ERROR: No refresh token stored'); return null; }

  var response = UrlFetchApp.fetch(
    'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
    {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: 'client_id=' + CONFIG.MS_CLIENT_ID +
               '&grant_type=refresh_token' +
               '&refresh_token=' + encodeURIComponent(refreshToken) +
               '&scope=Files.ReadWrite offline_access',
      muteHttpExceptions: true,
    }
  );

  var data = JSON.parse(response.getContentText());
  if (!data.access_token) {
    Logger.log('Token refresh failed: ' + response.getContentText());
    return null;
  }

  // Save updated refresh token
  props.setProperty('MS_REFRESH_TOKEN', data.refresh_token);
  return data.access_token;
}

// ── Microsoft Graph: Write File to OneDrive ───────────────────
function writeToOneDrive(content) {
  var accessToken = getMSAccessToken();
  if (!accessToken) return;

  var encodedPath = encodeURIComponent(CONFIG.ONEDRIVE_PATH).replace(/%2F/g, '/').replace(/%20/g, '%20');
  var url = 'https://graph.microsoft.com/v1.0/me/drive/root:/' + encodedPath + ':/content';

  var response = UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'text/plain; charset=utf-8',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    payload: content,
    muteHttpExceptions: true,
  });

  var data = JSON.parse(response.getContentText());
  if (data.name) {
    Logger.log('✅ Written to OneDrive: ' + data.name + ' (' + data.size + ' bytes)');
  } else {
    Logger.log('❌ OneDrive write failed: ' + response.getContentText());
  }
}

// ── Fetch from Notion ─────────────────────────────────────────
function fetchNotionTasks() {
  var payload = {
    filter: {
      and: [
        { property: 'Status', select: { does_not_equal: 'Done' } },
      ]
    },
    sorts: [{ property: 'Due Date', direction: 'ascending' }]
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

  var groups = { 'In Progress': [], 'Not Started': [], 'Awaiting Score': [] };

  tasks.forEach(function(page) {
    var props = page.properties;
    var title    = props['Name']     && props['Name'].title[0]     ? props['Name'].title[0].plain_text : '(no title)';
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

// ── One-time Setup: Store Refresh Token ──────────────────────
function storeRefreshToken() {
  // Run this ONCE manually after deploying
  // Replace the value below with your refresh token, then run this function
  var token = 'PASTE_REFRESH_TOKEN_HERE';
  PropertiesService.getScriptProperties().setProperty('MS_REFRESH_TOKEN', token);
  Logger.log('Refresh token stored successfully');
}
