// Trading Dashboard — Google Apps Script Backend
// Sheet ID: 1AaOa6GsK4vYjKNhFX0Qm6VyMjYpq-BWgZDyzXFVISb0

const SHEET_ID = '1AaOa6GsK4vYjKNhFX0Qm6VyMjYpq-BWgZDyzXFVISb0';
const TABS = { gex: 'GEX_HAN', swing: 'Swings', mike: 'Mike_Alerts' };

const HEADERS = {
  gex:   ['id', 'type', 'level', 'price', 'notes'],
  swing: ['id', 'name', 'ticker', 'strike', 'dir', 'contract', 'target'],
  mike:  ['id', 'cat', 'ticker', 'price', 'comment', 'ts'],
};

// ── Bootstrap sheets on first run ─────────────────────
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Object.entries(TABS).forEach(([key, name]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS[key]);
      sheet.getRange(1, 1, 1, HEADERS[key].length)
        .setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
    }
  });
}

// ── GET — read all rows for a section ─────────────────
function doGet(e) {
  const section = e.parameter.section;
  if (!section || !TABS[section]) {
    return jsonResponse({ error: 'Unknown section' });
  }
  const rows = readRows(section);
  return jsonResponse({ success: true, data: rows });
}

// ── POST — upsert or delete a row ─────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { section, action, row } = body;

    if (!section || !TABS[section]) return jsonResponse({ error: 'Unknown section' });

    if (action === 'upsert') {
      upsertRow(section, row);
      return jsonResponse({ success: true });
    }
    if (action === 'delete') {
      deleteRow(section, row.id);
      return jsonResponse({ success: true });
    }
    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ── Helpers ───────────────────────────────────────────
function getSheet(section) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(TABS[section]);
}

function readRows(section) {
  const sheet = getSheet(section);
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const headers = HEADERS[section];
  const values = sheet.getRange(2, 1, last - 1, headers.length).getValues();
  return values
    .filter(r => r[0] !== '')
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

function upsertRow(section, row) {
  const sheet = getSheet(section);
  const headers = HEADERS[section];
  const last = sheet.getLastRow();
  const ids = last >= 2
    ? sheet.getRange(2, 1, last - 1, 1).getValues().flat()
    : [];
  const rowData = headers.map(h => row[h] ?? '');
  const idx = ids.indexOf(row.id);
  if (idx >= 0) {
    sheet.getRange(idx + 2, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function deleteRow(section, id) {
  const sheet = getSheet(section);
  const last = sheet.getLastRow();
  if (last < 2) return;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues().flat();
  const idx = ids.indexOf(id);
  if (idx >= 0) sheet.deleteRow(idx + 2);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
