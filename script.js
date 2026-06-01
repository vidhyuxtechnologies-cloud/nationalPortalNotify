const dotenv = require('dotenv');
dotenv.config();

const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const { sendMail } = require('./emailService');

const EXCEL_PATH = 'My_Applications_List.xlsx';
const LAST_COUNT_PATH = path.join(__dirname, 'last_count.json');
const EXCEL_SNAPSHOT_JSON_PATH = path.join(__dirname, 'excel_snapshot.json');


function loadLastCount() {
  try {
    if (!fs.existsSync(LAST_COUNT_PATH)) return null;
    const raw = fs.readFileSync(LAST_COUNT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed?.count === 'number') return parsed.count;
    return null;
  } catch (e) {
    console.warn('Failed to read last_count.json:', e.message);
    return null;
  }
}

function saveLastCount(count) {
  try {
    fs.writeFileSync(LAST_COUNT_PATH, JSON.stringify({ count, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  } catch (e) {
    console.warn('Failed to write last_count.json:', e.message);
  }
}

function getDocumentCount() {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return { data, documentCount: data.length };
}

(async () => {
  const { data, documentCount } = getDocumentCount();
  console.log('Number of documents:', documentCount);

  // Persist full Excel snapshot to JSON (for monitoring/debug)
  try {
    fs.writeFileSync(EXCEL_SNAPSHOT_JSON_PATH, JSON.stringify({
      generatedAt: new Date().toISOString(),
      documentCount,
      rows: data,
    }, null, 2), 'utf8');
    console.log('Excel snapshot saved to excel_snapshot.json');

  const lastCount = loadLastCount();

  if (lastCount === null) {
    console.log('No last count found. Sending email with current count.');
    await sendMail(0, documentCount, { initial: true });
    saveLastCount(documentCount);
  } else {
    console.log(
      `Monitoring run. Previous count: ${lastCount}, current count: ${documentCount}. Sending email...`
    );
    await sendMail(lastCount, documentCount, { initial: false });
    saveLastCount(documentCount);
  }

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  // Example loop through documents
  for (let i = 0; i < data.length; i++) {
    console.log(`Processing document ${i + 1}`);

    // Example values from Excel
    const docName = data[i].DocumentName;

    console.log(docName);
  }

  await browser.close();
})();
