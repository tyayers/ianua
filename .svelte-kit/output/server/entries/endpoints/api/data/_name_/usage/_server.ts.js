import { j as json } from "../../../../../../chunks/index.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { s as serverUtils } from "../../../../../../chunks/server.utils.js";
const auth = new GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});
const sheets = google.sheets({ version: "v4", auth });
const POST = async ({ request, params }) => {
  const newUsage = await request.json();
  const name = params.name;
  let sheetConfig = void 0;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json();
  }
  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  const values = [];
  const newRow = [];
  newRow[0] = newUsage.id;
  newRow[1] = newUsage.name;
  newRow[2] = newUsage.action;
  newRow[3] = newUsage.dateTime;
  newRow[4] = newUsage.link;
  values.push(newRow);
  if (sheetConfig) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetConfig.sheetId,
        range: "Usage",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  return json(newUsage);
};
export {
  POST
};
