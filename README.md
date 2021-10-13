# cdk-library-certbot

A CDK Construct Library to automate the creation and renewal of Let's Encrypt certificates.

This library creates a Lambda function that utilizes Certbot to create certificates. Upon completion those certs are imported to AWS Certificate Manager (ACM) and uploaded to S3 and the email used for the certs is sent a notification. The function is also assigned an every Monday trigger to check if there is under 30 days remaining on the certificates that have been imported to ACM and if so it re-issues new certificates.

This construct will create all required components but optionally allows the users to pass their own S3 bucket, SNS topic, enable Lambda insights, and other customization as needed.
