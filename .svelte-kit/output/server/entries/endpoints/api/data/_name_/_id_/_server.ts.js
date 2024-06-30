import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { j as json } from "../../../../../../chunks/index.js";
import { s as serverUtils } from "../../../../../../chunks/server.utils.js";
const auth = new GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});
const sheets = google.sheets({ version: "v4", auth });
const PUT = async ({ request, url, params }) => {
  const updateRow = await request.json();
  const rangeStart = url.searchParams.get("rangeStart") ?? "";
  const name = params.name;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json();
  }
  let sheetConfig = void 0;
  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  const rowIndex = parseInt(updateRow[updateRow.length - 1]) + 2;
  updateRow.splice(updateRow.length - 1, 1);
  const values = [];
  values.push(updateRow);
  if (sheetConfig) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetConfig.sheetId,
        range: rangeStart + rowIndex,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values
        }
      });
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }
  return json(updateRow);
};
export {
  PUT
};
