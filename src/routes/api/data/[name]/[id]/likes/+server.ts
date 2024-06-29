import type { DataConfig } from "$lib/interfaces";
import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { serverUtils } from "$lib/server.utils";

const auth = new GoogleAuth({
	scopes: ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/contacts.readonly'
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const PATCH: RequestHandler = async({ params, url}) => {

  const name: string | undefined = params.name;
  const email: string = url.searchParams.get('email') ?? '';
  const row: string = url.searchParams.get('row') ?? '';
  const sheetRow: number = parseInt(row) + 2;
  const column: string = url.searchParams.get('column') ?? '';
  const columnLetter: string = String.fromCharCode((parseInt(column) + 1) +64)
  let result: string = email;

  let sheetConfig: DataConfig | undefined = undefined;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }

  if (sheetConfig) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + sheetRow + ':' + columnLetter + sheetRow,
    });

    let rows = res.data.values;

    if (!rows || rows.length === 0) {
      rows = [[email]];
    }
    else if (rows?.length === 1) {
      if (! rows[0][0])
        rows[0][0] = email;
      else if (! rows[0][0].includes(email)) {
        rows[0][0] += "," + email;
        result = rows[0][0];
      }
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + sheetRow + ':' + columnLetter + sheetRow,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[0][0]]]
      }
    });    
  }

  return json(result);
};

export const DELETE: RequestHandler = async({ params, url}) => {

  const name: string | undefined = params.name;
  const email: string = url.searchParams.get('email') ?? '';
  const row: string = url.searchParams.get('row') ?? '';
  const sheetRow = parseInt(row) + 2;
  const column: string = url.searchParams.get('column') ?? '';
  const columnLetter: string = String.fromCharCode((parseInt(column) + 1) +64)
  let result: string = "";
  let sheetConfig: DataConfig | undefined = undefined;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }

  if (sheetConfig) {
    const range: string = columnLetter + sheetRow + ':' + columnLetter + sheetRow;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig?.sheetId,
      range: range,
    });

    const rows = res.data.values;

    if (rows?.length === 1) {

      if (rows[0][0].includes(email)) {

        const likes: string[] = rows[0][0].split(",").map(function(item: string) {
          return item.trim();
        });
        const index = likes.indexOf(email);
        likes.splice(index, 1);
        rows[0][0] = likes.join(",");
        result = rows[0][0];
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetConfig?.sheetId,
        range: columnLetter + sheetRow + ':' + columnLetter + sheetRow,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[rows[0][0]]]
        }
      });
    }
  }

  return json(result);
};