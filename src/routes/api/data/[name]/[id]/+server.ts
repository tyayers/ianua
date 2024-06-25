import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { json, type RequestHandler } from "@sveltejs/kit";
import { PUBLIC_SHEETS_ID } from '$env/static/public';

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const sheets = google.sheets({version: 'v4', auth});

export const PUT: RequestHandler = async ({ request }) => {
  
  const updateRow: string[] = await request.json();
  const rowIndex = parseInt(updateRow[updateRow.length - 1]) + 2;
  updateRow.splice(updateRow.length - 1, 1);
  const values: string[][] = [];
  values.push(updateRow);

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: PUBLIC_SHEETS_ID,
      range: 'Assets!A' + rowIndex + ":M" + rowIndex,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values
      }
    });
  } catch (err) {
    console.log(JSON.stringify(err));
  }

  return json(updateRow);
};