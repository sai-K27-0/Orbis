// Orbis — Gmail → Notion Sync
// Watches Gmail for school emails and creates tasks in the Notion Tasks database.

var CONFIG = {
  NOTION_API_TOKEN: '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',
  NOTION_TASKS_DB: '34a483ac-69ec-811b-ab6d-f4bdb283f187',
  LABEL_NAME: 'orbis-synced',
  ALLOWED_SENDERS: [
    '@indusschool.com',      // catches all forwarded school emails
    'noreply@toddleapp.com', // Toddle assignment notifications
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
  // Remove existing triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'runSync') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('runSync')
    .timeBased()
    .everyMinutes(30)
    .create();
  Logger.log('Trigger created — runSync will run every 30 minutes');
}

function runSync() {
  var label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME);
  if (!label) {
    setup();
    label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME);
  }

  var threads = GmailApp.search('is:unread -label:' + CONFIG.LABEL_NAME, 0, 20);
  Logger.log('Threads to process: ' + threads.length);

  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(msg) {
      if (!msg.isUnread()) return;
      var from = msg.getFrom();
      if (!isAllowedSender(from)) return;

      var subject = msg.getSubject();
      var body    = msg.getPlainBody().substring(0, 500);
      var date    = msg.getDate();

      createNotionTask(subject, body, from, date);
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

function createNotionTask(subject, body, from, date) {
  var dueDate = extractDueDate(body) || Utilities.formatDate(
    new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd'
  );

  var payload = {
    parent: { database_id: CONFIG.NOTION_TASKS_DB },
    properties: {
      'Task': {
        title: [{ text: { content: subject } }]
      },
      'Status': {
        select: { name: 'Not Started' }
      },
      'Due Date': {
        date: { start: dueDate }
      },
      'Source': {
        select: { name: 'Gmail' }
      },
      'Priority': {
        select: { name: 'Medium' }
      }
    }
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.NOTION_API_TOKEN,
      'Notion-Version': '2022-06-28',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
  var code = response.getResponseCode();
  Logger.log('Notion response ' + code + ' for: ' + subject);
}

function extractDueDate(body) {
  // Looks for patterns like "Due: 2026-05-10" or "due by May 10"
  var isoMatch = body.match(/due[:\s]+(\d{4}-\d{2}-\d{2})/i);
  if (isoMatch) return isoMatch[1];
  return null;
}
