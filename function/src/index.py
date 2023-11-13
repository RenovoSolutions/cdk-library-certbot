# Modified from original gist https://gist.github.com/arkadiyt/5d764c32baa43fc486ca16cb8488169a

import boto3
import certbot.main
import datetime
import os
import subprocess
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from botocore.exceptions import ClientError

def store_in_secrets_manager(secret_name, secret_string):
  client = boto3.client('secretsmanager')
  try:
    create_args = {
      'Name': secret_name,
      'SecretString': secret_string
    }

    if 'CUSTOM_KMS_KEY_ID' in os.environ:
      create_args['KmsKeyId'] = os.environ['CUSTOM_KMS_KEY_ID']

    client.create_secret(**create_args)
  except ClientError as e:
    if e.response['Error']['Code'] == 'ResourceExistsException':
      update_args = {
        'SecretId': secret_name,
        'SecretString': secret_string
      }

      if 'CUSTOM_KMS_KEY_ID' in os.environ:
        update_args['KmsKeyId'] = os.environ['CUSTOM_KMS_KEY_ID']

      client.update_secret(**update_args)

def store_in_parameter_store(param_name, param_value):
  ssm = boto3.client('ssm')
  put_param_args = {
    'Name': param_name,
    'Value': param_value,
    'Type': 'SecureString',
    'Overwrite': True
  }

  if 'CUSTOM_KMS_KEY_ID' in os.environ:
    put_param_args['KeyId'] = os.environ['CUSTOM_KMS_KEY_ID']

  ssm.put_parameter(**put_param_args)

def upload_to_s3(local_path, keyname):
  print(f'INFO: Uploading {keyname} to S3')
  s3 = boto3.resource('s3')
  with open(local_path, 'rb') as file:
    data = file.read()
    s3.Bucket(os.environ['CERTIFICATE_BUCKET']).put_object(Key=f"{os.environ['OBJECT_PREFIX']}{keyname}", Body=data)

def read_and_delete_file(path, filename, storage_method):
  if not os.getenv("DRY_RUN", 'False').lower() in ["true", "1"]:
    with open(path, 'rb') as file:
      contents = file.read()
    
    try:
      string_contents = contents.decode('utf-8')
    except UnicodeDecodeError:
      print(f"Error: The file {filename} contains binary data that can't be decoded as UTF-8.")
      raise

    if storage_method == 's3':
      upload_to_s3(path, filename)
    elif storage_method == 'secretsmanager':
      store_in_secrets_manager(os.environ['CERTIFICATE_SECRET_PATH'] + filename, string_contents)
    elif storage_method == 'ssm_secure':
      store_in_parameter_store(os.environ['CERTIFICATE_PARAMETER_PATH'] + filename, string_contents)

    os.remove(path)
    return contents
  else:
    print(f'WARN: Dry run was used so {filename} was not generated.')

def provision_cert(email, domains, storage_method):
  cerbot_args = [
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
  ]
  if os.getenv("DRY_RUN", 'False').lower() in ["true", "1"]:
    print('WARN: Dry run was used so --dry-run was added to certbot args.')
    cerbot_args.append("--dry-run")

  certbot.main.main(cerbot_args)

  first_domain = domains.split(',')[0]
  path = '/tmp/config-dir/live/' + first_domain + '/'
  return {
    'certificate': read_and_delete_file(path + 'cert.pem', 'cert.pem', storage_method),
    'private_key': read_and_delete_file(path + 'privkey.pem', 'privkey.pem', storage_method),
    'certificate_chain': read_and_delete_file(path + 'chain.pem', 'chain.pem', storage_method)
  }

def should_provision(domains):
  existing_cert = find_existing_cert(domains)
  if existing_cert:
    print('INFO: Cert already exists. Checking date for reissue.')
    now = datetime.datetime.now(datetime.timezone.utc)
    not_after = existing_cert['Certificate']['NotAfter']
    reissue = (not_after - now).days <= int(os.environ['REISSUE_DAYS'])
    if reissue:
      print(f'INFO: Cert will expire sometime in the next {os.environ["REISSUE_DAYS"]} days so will be reissued.')
      return reissue
    else:
      print(f'INFO: Cert wont expire in next {os.environ["REISSUE_DAYS"]} days so will NOT be reissued.')
      return reissue
  else:
    print('INFO: Cert not found in ACM. Will issue new cert.')
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

def get_cert_info(certificate):
  cert = x509.load_pem_x509_certificate(certificate, default_backend())
  # could technically dig in and get all key info here, but this is the basics
  cert_info = f"""
Certificate info:
  Serial Number: {cert.serial_number}
  Issuer: {cert.issuer.rfc4514_string()}
  Validity:
    Not Before: {cert.not_valid_before}
    Not After: {cert.not_valid_after}
  Subject: {cert.subject.rfc4514_string()}
  Subject Alternative Names: {" ".join([n.value for n in cert.extensions[6].value])}
"""
  return cert_info


def notify_via_sns(topic_arn, domains, certificate):
  print('INFO: Sending SNS notification')
  cert = get_cert_info(certificate)

  client = boto3.client('sns')
  client.publish(TopicArn=topic_arn,
    Subject='Issued new LetsEncrypt certificate',
    Message='Issued new certificates for domains: ' + domains + '\n\n' + cert,
  )

def upload_cert_to_acm(cert, domains):
  print('INFO: Importing cert to ACM')
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
  storage_method = os.getenv('CERTIFICATE_STORAGE', 's3').lower()

  print("CERTIFICATE_STORAGE: " + storage_method)
  print("LETSENCRYPT_DOMAINS: " + os.environ['LETSENCRYPT_DOMAINS'])
  print("LETSENCRYPT_EMAIL: " + os.environ['LETSENCRYPT_EMAIL'])
  print("PREFERRED_CHAIN: " + os.environ['PREFERRED_CHAIN'])
  print("DRY_RUN: " + os.environ['DRY_RUN'])

  # Check for required environment variables based on storage method
  if storage_method == 's3' and 'CERTIFICATE_BUCKET' not in os.environ:
    raise ValueError("S3 storage selected but CERTIFICATE_BUCKET is not set")
  elif storage_method == 'secretsmanager' and 'CERTIFICATE_SECRET_PATH' not in os.environ:
    raise ValueError("Secrets Manager storage selected but CERTIFICATE_SECRET_PATH is not set")
  elif storage_method == 'ssm_secure' and 'CERTIFICATE_PARAMETER_PATH' not in os.environ:
    raise ValueError("Parameter Store storage selected but CERTIFICATE_PARAMETER_PATH is not set")

  domains = os.environ['LETSENCRYPT_DOMAINS']
  if should_provision(domains):
    cert = provision_cert(os.environ['LETSENCRYPT_EMAIL'], domains, storage_method)
    if not os.getenv("DRY_RUN", 'False').lower() in ["true", "1"]:
      upload_cert_to_acm(cert, domains)
      notify_via_sns(os.environ['NOTIFICATION_SNS_ARN'], domains, cert['certificate'])
    else:
      print('WARN: Dry run was used so ACM import and storage upload arent tested.')
