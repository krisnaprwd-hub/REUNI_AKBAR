/**
 * Template Google Apps Script untuk Google Sheets.
 *
 * 1. Buat/buka Google Spreadsheet kosong.
 * 2. Buka Extensions > Apps Script.
 * 3. Hapus kode bawaan, tempel kode ini, lalu simpan.
 * 4. Klik Deploy > New deployment.
 * 5. Pilih type Web app.
 * 6. Execute as: Me.
 * 7. Who has access: Anyone.
 * 8. Klik Deploy dan salin Web app URL ke config.js.
 */

const SPREADSHEET_ID = "19a0MlgUaVGv8Eb0RYL-QfRae8OUQeXg8Cno-JEjf-k";
const SHEET_NAME = "Peserta Reuni";

function ensureSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Waktu Daftar",
      "Nama",
      "Angkatan",
      "Nomor HP",
      "Nomor Undian"
    ]);
  }

  return sheet;
}

function doPost(request) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = JSON.parse(request.postData.contents);
    const sheet = ensureSheet();
    const raffleNumber = `RA-${String(sheet.getLastRow()).padStart(4, "0")}`;

    sheet.appendRow([
      data.registeredAt || new Date().toISOString(),
      data.name,
      data.graduationYear,
      data.phone,
      raffleNumber
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, raffleNumber }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  ensureSheet();
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
