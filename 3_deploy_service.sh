gcloud config set project $PROJECT_ID

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --format 'value(status.url)' --region $REGION)

# First deploy to Cloud Run
if [ -z "${SERVICE_URL}" ]; then 
  gcloud run deploy $SERVICE_NAME --source . \
    --platform managed --region $REGION --allow-unauthenticated --min-instances=1

  SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --format 'value(status.url)' --region $REGION)
fi

# Deploy to Cloud Run
SECONDS=0
gcloud run deploy $SERVICE_NAME --source . --platform managed --project "$PROJECT_ID" \
	--region $REGION --allow-unauthenticated \
  --service-account=asset-service@$PROJECT_ID.iam.gserviceaccount.com --port=3000 \
  --set-env-vars "ORIGIN=$SERVICE_URL,VITE_ORIGIN=$SERVICE_URL"
duration=$SECONDS
echo "Deployment finished in $((duration / 60)) minutes and $((duration % 60)) seconds."