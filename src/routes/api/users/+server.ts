import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

const auth = new GoogleAuth({
	scopes: ["https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});

const people = google.people({version: 'v1', auth});

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get('email') ?? '';

  const result = await people.people.searchDirectoryPeople({
    "query": email,
    "readMask": "names,coverPhotos",
    "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"]
  });

  //console.log(JSON.stringify(result.status));

  return json(result.data);
};