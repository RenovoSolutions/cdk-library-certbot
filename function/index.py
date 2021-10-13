# Modified from original gist https://gist.github.com/arkadiyt/5d764c32baa43fc486ca16cb8488169a

import boto3
import certbot.main
import datetime
import os
import subprocess
import logging

def upload_to_s3(local_path, keyname):
  logging.info('Uploading files to S3')
  s3 = boto3.resource('s3')
  data = open(local_path, 'rb')
  s3.Bucket(os.environ['CERTIFICATE_BUCKET']).put_object(Key=f"{os.environ['OBJECT_PREFIX']}{keyname}", Body=data)

def read_and_delete_file(path, filename):
  upload_to_s3(path, filename)

  with open(path, 'r') as file:
    contents = file.read()
  os.remove(path)
  return contents

def provision_cert(email, domains):
  certbot.main.main([
    'certonly',                             # Obtain a cert but don't install it
    '-n',                                   # Run in non-interactive mode
    '--agree-tos',                          # Agree to the terms of service,
    '--email', email,                       # Email
    '--dns-route53',                        # Use dns challenge with route53
    '-d', domains,                          # Domains to provision certs for
    # Override directory paths so script doesn't have to be run as root
    '--config-dir', '/tmp/config-dir/',
    '--work-dir', '/tmp/work-dir/',
    '--logs-dir', '/tmp/logs-dir/',
    '--preferred-chain', os.environ['PREFERRED_CHAIN'],
  ])

  first_domain = domains.split(',')[0]
  path = '/tmp/config-dir/live/' + first_domain + '/'
  return {
    'certificate': read_and_delete_file(path + 'cert.pem', 'cert.pem'),
    'private_key': read_and_delete_file(path + 'privkey.pem', 'privkey.pem'),
    'certificate_chain': read_and_delete_file(path + 'chain.pem', 'chain.pem')
  }

def should_provision(domains):
  existing_cert = find_existing_cert(domains)
  if existing_cert:
    logging.info('Cert already exists. Checking date for reissue.')
    now = datetime.datetime.now(datetime.timezone.utc)
    not_after = existing_cert['Certificate']['NotAfter']
    reissue = (not_after - now).days <= int(os.environ['REISSUE_DAYS'])
    if reissue:
      logging.info(f'Cert will expire sometime in the next {os.environ["REISSUE_DAYS"]} days so will be reissued.')
      return reissue
    else:
      logging.info(f'Cert wont expire in next {os.environ["REISSUE_DAYS"]} days so will NOT be reissued.')
      return reissue
  else:
    logging.info('Cert not found in ACM. Will issue new cert.')
    return True

def find_existing_cert(domains):
  domains = frozenset(domains.split(','))

  client = boto3.client('acm')
  paginator = client.get_paginator('list_certificates')
  iterator = paginator.paginate(PaginationConfig={'MaxItems':1000})

  for page in iterator:
    for cert in page['CertificateSummaryList']:
      cert = client.describe_certificate(CertificateArn=cert['CertificateArn'])
      sans = frozenset(cert['Certificate']['SubjectAlternativeNames'])
      if sans.issubset(domains):
        return cert

  return None

def notify_via_sns(topic_arn, domains, certificate):
  logging.info('Sending SNS notification')
  process = subprocess.Popen(['openssl', 'x509', '-noout', '-text'],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, encoding='utf8')
  stdout, stderr = process.communicate(certificate)

  client = boto3.client('sns')
  client.publish(TopicArn=topic_arn,
    Subject='Issued new LetsEncrypt certificate',
    Message='Issued new certificates for domains: ' + domains + '\n\n' + stdout,
  )

def upload_cert_to_acm(cert, domains):
  logging.info('Importing cert to ACM')
  existing_cert = find_existing_cert(domains)
  certificate_arn = existing_cert['Certificate']['CertificateArn'] if existing_cert else None

  client = boto3.client('acm')
  if certificate_arn == None:
    acm_response = client.import_certificate(
      Certificate=cert['certificate'],
      PrivateKey=cert['private_key'],
      CertificateChain=cert['certificate_chain']
    )
  else:
    acm_response = client.import_certificate(
      CertificateArn=certificate_arn,
      Certificate=cert['certificate'],
      PrivateKey=cert['private_key'],
      CertificateChain=cert['certificate_chain']
    )

  return None if certificate_arn else acm_response['CertificateArn']

def handler(event, context):
  domains = os.environ['LETSENCRYPT_DOMAINS']
  if should_provision(domains):
    cert = provision_cert(os.environ['LETSENCRYPT_EMAIL'], domains)
    upload_cert_to_acm(cert, domains)
    notify_via_sns(os.environ['NOTIFICATION_SNS_ARN'], domains, cert['certificate'])
