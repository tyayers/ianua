import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { Config, DataConfig } from "$lib/interfaces";
import crypto from "crypto";
import { PUBLIC_SHEETS_ID } from '$env/static/public';

let AppConfig: Config | undefined = undefined;

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const GET: RequestHandler = async ( {params, fetch} ) => {

  if (!AppConfig) AppConfig = await (await fetch("/api/config")).json();

  const name: string | undefined = params.name;
  const config: DataConfig | undefined = AppConfig?.data.find(data => data.name === name);
  let rows: string[][] | null | undefined = [];
  let headers: string[] = [];

  if (config) {

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: config.rangeStart + "1:" + config.rangeEnd,
    });

    const headersResult = res.data.values;
    if (headersResult && headersResult.length > 0) headers = headersResult[0];
    headers.push("rowNumber");

    const res2 = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: config.rangeStart + "2:" + config.rangeEnd,
    });
    rows = res2.data.values;

    if (!rows || rows.length === 0) {
      console.log('No data found.');
      rows = [];
    } else {
      rows.forEach((row, i) => {
        let id: string = row[0].toString();
        if (!id || id.length < 2) {
          id = crypto.randomBytes(10).toString("hex");
          row[0] = id;
          updateRow(row, i, config.rangeStart, config.rangeEnd);
        }

        while(row.length < headers.length - 1)
          row.push("");

        row.push(i.toString());
      });
    }
  }

  return json({
    headers: headers,
    rows: rows
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const newRow: string[] = await request.json();
  newRow[0] = crypto.randomBytes(10).toString("hex");

  const values: string[][] = [];
  values.push(newRow);

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: PUBLIC_SHEETS_ID,
      range: 'Assets',
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values
      }
    });
  } catch (err) {
    console.error(err);
  }

  return json(newRow);
};

async function updateRow(row: string[], index: number, rangeStart: string, rangeEnd: string) {
  const rangeToUpdate: string = rangeStart + index + 2 + ":" + rangeEnd + index + 2;
  console.log(`Preparing to update row: ${rangeToUpdate}`);

  await sheets.spreadsheets.values.update({
    spreadsheetId: PUBLIC_SHEETS_ID,
    range: rangeToUpdate,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
}