import { j as json } from "../../../../chunks/index.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
const auth = new GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/directory.readonly"
  ]
});
const people = google.people({ version: "v1", auth });
const GET = async ({ url }) => {
  const email = url.searchParams.get("email") ?? "";
  const result = await people.people.searchDirectoryPeople({
    "query": email,
    "readMask": "names,coverPhotos",
    "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"]
  });
  return json(result.data);
};
export {
  GET
};
