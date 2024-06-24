import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { PUBLIC_SHEETS_ID } from '$env/static/public';

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const GET: RequestHandler = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: PUBLIC_SHEETS_ID,
    range: 'A1:M1',
  });
  const rows = res.data.values;
  let headers: string[] = [];

  if (rows && rows.length > 0) {
    headers = rows[0];
  }

  return json(headers);
}