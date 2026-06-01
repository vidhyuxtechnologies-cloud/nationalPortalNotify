const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Usage:
//   node excel_to_json.js
// This script reads My_Applications_List.xlsx and writes all rows into:
//   excel_data.json

const EXCEL_PATH = path.join(__dirname, 'My_Applications_List.xlsx');
const OUTPUT_JSON_PATH = path.join(__dirname, 'excel_data.json');

function main() {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const payload = {
    generatedAt: new Date().toISOString(),
    sheetName,
    rowCount: rows.length,
    rows,
  };

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Wrote ${rows.length} rows to ${path.basename(OUTPUT_JSON_PATH)}`);
}

main();

