import pytest
import os

@pytest.fixture(autouse=True)
def set_env_vars():
  os.environ['LETSENCRYPT_EMAIL'] = 'email@example.com'
  os.environ['LETSENCRYPT_DOMAINS'] = 'example.com'
  os.environ['PREFERRED_CHAIN'] = 'ISRG Root X1'
  os.environ['CERTIFICATE_BUCKET'] = 'example-cert-bucket'
  os.environ['CERTIFICATE_STORAGE'] = 's3'
  os.environ['NOTIFICATION_SNS_ARN'] = 'arn:aws:sns:us-east-1:123456789012:example-topic'
  os.environ['REISSUE_DAYS'] = '30'
  os.environ['DRY_RUN'] = 'False'
  os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'
  os.environ['AWS_REGION'] = 'us-east-1'
  os.environ['AWS_ACCESS_KEY_ID'] = 'fake'
  os.environ['AWS_SECRET_ACCESS_KEY'] = 'fake'
  os.environ['OBJECT_PREFIX'] = ''
  os.environ['EFS_PATH'] = '/tmp/efs'
  yield
