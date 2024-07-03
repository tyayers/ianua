import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import {DataConfig, UsageData} from "$lib/interfaces";
import { utils } from "$lib/utilities";

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const POST: RequestHandler = async ({ request, params, fetch }) => {

  const newUsage: UsageData = await request.json();
  const name: string | undefined = params.name;
  let sheetConfig: DataConfig | undefined = undefined;

  if (!utils.config) {
    utils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = utils.GetSheetConfig(name);

  const values: string[][] = [];
  const newRow: string[] = [];

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
        range: 'Usage',
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: values
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  return json(newUsage);
}