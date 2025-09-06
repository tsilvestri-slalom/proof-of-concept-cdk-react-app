#!/bin/bash
npm run build
aws s3 sync build/ s3://react-app-bucket-YOUR-ACCOUNT-ID-YOUR-REGION --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"