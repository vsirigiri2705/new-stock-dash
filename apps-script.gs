// Trading Dashboard — Google Apps Script Backend
// All operations via GET to avoid CORS preflight issues

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

// ── ALL operations via GET ─────────────────────────────
// ?action=read&section=gex
// ?action=upsert&section=gex&row={"id":...}
// ?action=delete&section=gex&id=abc123
function doGet(e) {
  try {
    const action  = e.parameter.action  || 'read';
    const section = e.parameter.section || '';

    if (!section || !TABS[section]) {
      return jsonOut({ success: false, error: 'Unknown section: ' + section });
    }

    if (action === 'read') {
      return jsonOut({ success: true, data: readRows(section) });
    }

    if (action === 'upsert') {
      const row = JSON.parse(decodeURIComponent(e.parameter.row));
      upsertRow(section, row);
      return jsonOut({ success: true });
    }

    if (action === 'delete') {
      deleteRow(section, e.parameter.id);
      return jsonOut({ success: true });
    }

    return jsonOut({ success: false, error: 'Unknown action' });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
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
    .map(r => Object.fromEntries(headers.map((h, i) => [h, String(r[i])])));
}

function upsertRow(section, row) {
  const sheet = getSheet(section);
  const headers = HEADERS[section];
  const last = sheet.getLastRow();
  const ids = last >= 2
    ? sheet.getRange(2, 1, last - 1, 1).getValues().flat().map(String)
    : [];
  const rowData = headers.map(h => row[h] ?? '');
  const idx = ids.indexOf(String(row.id));
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
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues().flat().map(String);
  const idx = ids.indexOf(String(id));
  if (idx >= 0) sheet.deleteRow(idx + 2);
}

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
