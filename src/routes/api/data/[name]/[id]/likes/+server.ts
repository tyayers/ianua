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

  const id: string | undefined = params.id;
  const name: string | undefined = params.name;
  const email: string = url.searchParams.get('email') ?? '';
  let sheetConfig: DataConfig | undefined = undefined;
  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetConfig?.sheetId,
    range: 'A2:M',
  });
  let resultLikes: string = email;

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log('No data found.');
  } else {

    let rowIndex: number = -1;

    for (let i=0; i<rows.length; i++) {
      const row = rows[i];
      if (row[0] == id) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex >= 0) {
      if (!rows[rowIndex][11])
        rows[rowIndex][11] = email;
      else if (!rows[rowIndex][11].includes(email)) {
        rows[rowIndex][11] += "," + email;
        resultLikes = rows[rowIndex][11];
      }
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: 'L' + (rowIndex + 2) + ':L' + (rowIndex + 2),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[rowIndex][11]]]
      }
    });
  }

  return json(resultLikes);
};

export const DELETE: RequestHandler = async({ params, url}) => {

  const id: string | undefined = params.id;
  const email: string = url.searchParams.get('email') ?? '';
  const name: string | undefined = params.name;

  let sheetConfig: DataConfig | undefined = undefined;

  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetConfig?.sheetId,
    range: 'A2:M',
  });
  let resultLikes: string[] = [email];

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log('No data found.');
  } else {

    let rowIndex: number = -1;

    for (let i=0; i<rows.length; i++) {
      const row = rows[i];
      if (row[0] == id) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex >= 0 && rows[rowIndex] && rows[rowIndex][11]) {
      if (rows[rowIndex][11].includes(email)) {
        const likes: string[] = rows[rowIndex][11].split(",").map(function(item: string) {
          return item.trim();
        });
        const index = likes.indexOf(email);
        likes.splice(index, 1);
        rows[rowIndex][11] = likes.join(",");
        resultLikes = rows[rowIndex][11];
      }
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetConfig?.sheetId,
      range: 'L' + (rowIndex + 2) + ':L' + (rowIndex + 2),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[rows[rowIndex][11]]]
      }
    });
  }

  return json(resultLikes);
};