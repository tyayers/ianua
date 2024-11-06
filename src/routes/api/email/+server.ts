import { json, type RequestHandler } from "@sveltejs/kit";
import { GoogleAuth } from "google-auth-library";
import { PUBLIC_PROJECT_ID, PUBLIC_REGION } from '$env/static/public';

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

export const POST: RequestHandler = async ({ request, url, params }) => {
  const email = url.searchParams.get('email') ?? '';
  const message = url.searchParams.get('message') ?? '';

  const token = await auth.getAccessToken();
  const response = await fetch(`https://integrations.googleapis.com/v2/projects/${PUBLIC_PROJECT_ID}/locations/${PUBLIC_REGION}/integrations/SendEmailFeedback:execute?triggerId=api_trigger/SendEmailFeedback_API_1`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "EmailRecipients": [email],
      "EmailContentsHtml": message
    })
  });

  return json({
    success: true
  });
}