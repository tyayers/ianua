import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { DataConfig } from "$lib/interfaces";
import { serverUtils } from "$lib/server.utils";
import crypto from "crypto";

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const GET: RequestHandler = async ( {params, fetch} ) => {

  const name: string | undefined = params.name;
  let sheetConfig: DataConfig | undefined = undefined;

  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  
  let rows: string[][] | null | undefined = [];
  let headers: string[] = [];

  if (sheetConfig) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheetId,
      range: `${sheetConfig.rangeStart}${sheetConfig.rowStart}:Z`,
    });

    const headersResult = res.data.values;
    if (headersResult && headersResult.length > 0) headers = headersResult[0];
    sheetConfig.rangeEnd = String.fromCharCode(headers.length+64);
    headers.push("rowNumber");
    const res2 = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.sheetId,
      range: sheetConfig.rangeStart + "2:" + sheetConfig.rangeEnd,
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
          updateRow(row, i, sheetConfig.rangeStart, sheetConfig.rangeEnd, sheetConfig.sheetId);
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

export const POST: RequestHandler = async ({ request, params }) => {

  const name: string | undefined = params.name;
  let sheetConfig: DataConfig | undefined = undefined;

  if (!serverUtils.config) {
    serverUtils.config = await (await fetch("/api/config")).json()
  }

  if (name)
    sheetConfig = serverUtils.GetSheetConfig(name);
  
  const newRow: string[] = await request.json();
  newRow[0] = crypto.randomBytes(10).toString("hex");

  const values: string[][] = [];
  values.push(newRow);

  if (sheetConfig) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetConfig.sheetId,
        range: sheetConfig.rangeStart,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: values
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  return json(newRow);
};

async function updateRow(row: string[], index: number, rangeStart: string, rangeEnd: string, sheetsId: string) {
  const rangeToUpdate: string = rangeStart + (index + 2).toString() + ":" + rangeEnd + (index + 2).toString();
  console.log(`Preparing to update row: ${rangeToUpdate}`);

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetsId,
    range: rangeToUpdate,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
}