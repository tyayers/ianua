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

  // const id: string | undefined = params.id;
  const name: string | undefined = params.name;
  const email: string = url.searchParams.get('email') ?? '';
  const row: string = url.searchParams.get('row') ?? '';
  const column: string = url.searchParams.get('column') ?? '';
  const columnLetter: string = String.fromCharCode((parseInt(column) + 1) +64)

  let sheetConfig: DataConfig | undefined = undefined;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetConfig?.sheetId,
    range: sheetConfig?.rangeStart + row + ":" + sheetConfig?.rangeEnd + row,
  });
  let resultLikes: string = email;

  const rows = res.data.values;

  if (rows?.length === 1) {

    if (! rows[0][parseInt(column)])
      rows[0][parseInt(column)] = email;
    else if (! rows[0][parseInt(column)].includes(email)) {
      rows[0][parseInt(column)] += "," + email;
      resultLikes = rows[0][parseInt(column)];
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + (parseInt(row) + 2) + ':' + columnLetter + (parseInt(row)),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[0][parseInt(column)]]]
      }
    });
  }

  return json(resultLikes);
};

export const DELETE: RequestHandler = async({ params, url}) => {

  // const id: string | undefined = params.id;
  const name: string | undefined = params.name;
  const email: string = url.searchParams.get('email') ?? '';
  const row: string = url.searchParams.get('row') ?? '';
  const column: string = url.searchParams.get('column') ?? '';
  const columnLetter: string = String.fromCharCode((parseInt(column) + 1) +64)

  let sheetConfig: DataConfig | undefined = undefined;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name) {
    sheetConfig = serverUtils.GetSheetConfig(name);
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetConfig?.sheetId,
    range: sheetConfig?.rangeStart + row + ":" + sheetConfig?.rangeEnd + row,
  });
  let resultLikes: string = email;

  const rows = res.data.values;

  if (rows?.length === 1) {

    if (! rows[0][parseInt(column)].includes(email)) {

      const likes: string[] = rows[0][parseInt(column)].split(",").map(function(item: string) {
        return item.trim();
      });
      const index = likes.indexOf(email);
      likes.splice(index, 1);
      rows[0][parseInt(column)] = likes.join(",");
      resultLikes = rows[0][parseInt(column)];
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: columnLetter + (parseInt(row) + 2) + ':' + columnLetter + (parseInt(row)),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[0][parseInt(column)]]]
      }
    });
  }

  return json(resultLikes);
};