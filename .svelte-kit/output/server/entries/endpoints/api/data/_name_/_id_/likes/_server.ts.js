import { j as json } from "../../../../../../../chunks/index.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { s as serverUtils } from "../../../../../../../chunks/server.utils.js";
const auth = new GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly"
  ]
});
const sheets = google.sheets({ version: "v4", auth });
const PATCH = async ({ params, url }) => {
  const name = params.name;
  const email = url.searchParams.get("email") ?? "";
  const row = url.searchParams.get("row") ?? "";
  const sheetRow = parseInt(row) + 2;
  const column = url.searchParams.get("column") ?? "";
  const columnLetter = String.fromCharCode(parseInt(column) + 1 + 64);
  let result = email;
  let sheetConfig = void 0;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json();
  }
  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }
  if (sheetConfig) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + sheetRow + ":" + columnLetter + sheetRow
    });
    let rows = res.data.values;
    if (!rows || rows.length === 0) {
      rows = [[email]];
    } else if (rows?.length === 1) {
      if (!rows[0][0])
        rows[0][0] = email;
      else if (!rows[0][0].includes(email)) {
        rows[0][0] += "," + email;
        result = rows[0][0];
      }
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + sheetRow + ":" + columnLetter + sheetRow,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[0][0]]]
      }
    });
  }
  return json(result);
};
const DELETE = async ({ params, url }) => {
  const name = params.name;
  const email = url.searchParams.get("email") ?? "";
  const row = url.searchParams.get("row") ?? "";
  const sheetRow = parseInt(row) + 2;
  const column = url.searchParams.get("column") ?? "";
  const columnLetter = String.fromCharCode(parseInt(column) + 1 + 64);
  let result = "";
  let sheetConfig = void 0;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json();
  }
  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }
  if (sheetConfig) {
    const range = columnLetter + sheetRow + ":" + columnLetter + sheetRow;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig?.sheetId,
      range
    });
    const rows = res.data.values;
    if (rows?.length === 1) {
      if (rows[0][0].includes(email)) {
        const likes = rows[0][0].split(",").map(function(item) {
          return item.trim();
        });
        const index = likes.indexOf(email);
        likes.splice(index, 1);
        rows[0][0] = likes.join(",");
        result = rows[0][0];
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetConfig?.sheetId,
        range: columnLetter + sheetRow + ":" + columnLetter + sheetRow,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[rows[0][0]]]
        }
      });
    }
  }
  return json(result);
};
export {
  DELETE,
  PATCH
};
