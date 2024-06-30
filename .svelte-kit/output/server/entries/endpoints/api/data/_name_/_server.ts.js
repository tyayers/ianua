import { j as json } from "../../../../../chunks/index.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { s as serverUtils } from "../../../../../chunks/server.utils.js";
import crypto from "crypto";
const auth = new GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});
const sheets = google.sheets({ version: "v4", auth });
const GET = async ({ params, fetch: fetch2 }) => {
  const name = params.name;
  let sheetConfig = void 0;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch2("/api/config")).json();
  }
  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  let rows = [];
  let headers = [];
  if (sheetConfig) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheetId,
      range: `${sheetConfig.rangeStart}${sheetConfig.rowStart}:Z`
    });
    const headersResult = res.data.values;
    if (headersResult && headersResult.length > 0)
      headers = headersResult[0];
    sheetConfig.rangeEnd = String.fromCharCode(headers.length + 64);
    headers.push("rowNumber");
    const res2 = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheetId,
      range: sheetConfig.rangeStart + "2:" + sheetConfig.rangeEnd
    });
    rows = res2.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found.");
      rows = [];
    } else {
      rows.forEach((row, i) => {
        let id = row[0].toString();
        if (!id || id.length < 2) {
          id = crypto.randomBytes(10).toString("hex");
          row[0] = id;
          updateRow(row, i, sheetConfig.rangeStart, sheetConfig.rangeEnd, sheetConfig.sheetId);
        }
        while (row.length < headers.length - 1)
          row.push("");
        row.push(i.toString());
      });
    }
  }
  return json({
    headers,
    rows
  });
};
const POST = async ({ request, params }) => {
  const name = params.name;
  let sheetConfig = void 0;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json();
  }
  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  const newRow = await request.json();
  newRow[0] = crypto.randomBytes(10).toString("hex");
  const values = [];
  values.push(newRow);
  if (sheetConfig) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetConfig.sheetId,
        range: sheetConfig.rangeStart + ":" + sheetConfig.rangeEnd,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  return json(newRow);
};
async function updateRow(row, index, rangeStart, rangeEnd, sheetsId) {
  const rangeToUpdate = rangeStart + (index + 2).toString() + ":" + rangeEnd + (index + 2).toString();
  console.log(`Preparing to update row: ${rangeToUpdate}`);
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetsId,
    range: rangeToUpdate,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
}
export {
  GET,
  POST
};
