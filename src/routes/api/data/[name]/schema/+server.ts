import type { DataConfig } from "$lib/interfaces";
import { serverUtils } from "$lib/server.utils";
import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const GET: RequestHandler = async ({params}) => {
  const name: string | undefined = params.name;
  let sheetConfig: DataConfig | undefined = undefined;

  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);

  let headers: string[] = [];

  if (sheetConfig) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheetId,
      range: 'A1:M1',
    });
    const rows = res.data.values;

    if (rows && rows.length > 0) {
      headers = rows[0];
    }
  }

  return json(headers);
}