import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { json, type RequestHandler } from "@sveltejs/kit";
import type { DataConfig } from "$lib/interfaces";
import { serverUtils } from "$lib/server.utils";

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const PUT: RequestHandler = async ({ request, url, params }) => {

  const updateRow: string[] = await request.json();
  const rangeStart = url.searchParams.get("rangeStart") ?? "";
  const name = params.name;

  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  let sheetConfig: DataConfig | undefined = undefined;
  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  
  const rowIndex = parseInt(updateRow[updateRow.length - 1]) + 2;
  updateRow.splice(updateRow.length - 1, 1);
  const values: string[][] = [];
  values.push(updateRow);

  if (sheetConfig) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetConfig.sheetId,
        range: rangeStart + rowIndex,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: values
        }
      });
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }

  return json(updateRow);
};