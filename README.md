# cdk-library-certbot

A CDK Construct Library to automate the creation and renewal of Let's Encrypt certificates.

This library creates a Lambda function that utilizes Certbot to create certificates. Upon completion of the scheduled creation those certs are imported to AWS Certificate Manager (ACM) and uploaded to S3 and the email used for the certs is sent a notification from SNS. The function is also assigned, by default, an every Sunday trigger to check if there is under 30 days remaining on the certificates that have been imported to ACM and if so it attempts to re-issues new certificates.

This construct will create all required components but optionally allows the users to pass their own S3 bucket, SNS topic, enable Lambda insights, and other customization of items like schedule, lambda architecture, reissue days. See the [API](API.md) documentation for full details. You can also see example usage in this repo [example/example.ts](example/example.ts)
