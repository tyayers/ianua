import type { Asset } from "$lib/interfaces";
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
  
  const updateAsset: Asset = await request.json();

  const values: string[][] = [];
  const newRow: string[] = [];
  newRow[0] = updateAsset.id;
  newRow[1] = updateAsset.name;
  newRow[2] = updateAsset.type.join(",");
  newRow[3] = updateAsset.details;
  newRow[4] = updateAsset.owner;
  newRow[5] = updateAsset.status;
  newRow[6] = updateAsset.level.join(",");
  newRow[7] = updateAsset.audience;
  newRow[8] = updateAsset.lastUpdated;
  newRow[9] = updateAsset.link;
  newRow[10] = updateAsset.products.join(",");
  newRow[11] = updateAsset.likes.join(",");
  newRow[12] = updateAsset.keywords.join(",");

  values.push(newRow);

  if (updateAsset.row > 1) {
    try {
      const newIndex: number = updateAsset.row + 2;
      await sheets.spreadsheets.values.update({
        spreadsheetId: PUBLIC_SHEETS_ID,
        range: 'Assets!A' + newIndex + ":M" + newIndex,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: values
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  else {
    console.error("Could not update asset, no row id found to write to sheets: " + JSON.stringify(updateAsset));
  }

  return json(updateAsset);
};