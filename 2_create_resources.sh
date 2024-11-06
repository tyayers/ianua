echo "Setting project to $PROJECT_ID"
gcloud config set project $PROJECT_ID

gcloud services enable identitytoolkit.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable people.googleapis.com

echo "Enabling Identity Platfoorm..."
curl -X POST "https://identitytoolkit.googleapis.com/v2/projects/$PROJECT_ID/identityPlatform:initializeAuth" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "x-goog-user-project: $PROJECT_ID"
# enable email
curl -X PATCH "https://identitytoolkit.googleapis.com/v2/projects/$PROJECT_ID/config?updateMask=signIn.email" \
	-H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
	-H "x-goog-user-project: $PROJECT_ID" \
  --data-binary @- << EOF
	
{
  "name": "projects/937046317798/config",
  "signIn": {
    "email": {
      "enabled": true,
      "passwordRequired": true
    },
    "hashConfig": {
      "algorithm": "SCRYPT",
      "signerKey": "UR7cDda9h0UoH82KHu0Frglb11vEFmMgzGI4uIgLvDMANTrMAQrQ/z34SkAcz6k0K6heLjizyQlHlU7iSidBvw==",
      "saltSeparator": "Bw==",
      "rounds": 8,
      "memoryCost": 14
    }
  }
}
EOF

gcloud iam service-accounts create asset-service \
    --description="Service account to manage assets" \
    --display-name="AssetService"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:asset-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.invoker"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:asset-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/integrations.integrationInvoker"

echo "Setting web app variables..."
touch .env
echo $"PUBLIC_SITE_NAME=$SITE_NAME" >> .env
echo $"PUBLIC_TEST_MODE=false" >> .env
echo $"PUBLIC_TEST_EMAIL=" >> .env
