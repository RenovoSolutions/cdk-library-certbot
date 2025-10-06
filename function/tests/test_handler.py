"""Test driver for the lambda."""
import os
import sys
import datetime
import pathlib
from unittest.mock import patch, mock_open, MagicMock

import pytest
import boto3
from moto import mock_aws
from cryptography import x509

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import src.index as index # pylint: disable=wrong-import-position

mock_list_certs_response = {
    "CertificateSummaryList": [
        {
            "CertificateArn": (
                "arn:aws:acm:region:123456789012:certificate/"
                "12345678-1234-1234-1234-123456789012"
            ),
            "DomainName": "example.com",
        },
        {
            "CertificateArn": (
                "arn:aws:acm:region:123456789012:certificate/"
                "12345678-1234-1234-1234-123456789013"
            ),
            "DomainName": "example2.com",
        },
    ]
}

mock_response = {
    "Certificate": {
        "CertificateArn": (
            "arn:aws:acm:region:123456789012:certificate/"
            "12345678-1234-1234-1234-123456789012"
        ),
        "SubjectAlternativeNames": ["example.com", "www.example.com"],
    }
}

MOCK_CERTIFICATE = b"""-----BEGIN CERTIFICATE-----
MIIE+zCCAuMCFGX4FZJHqfPYrEqXSlutm5puelilMA0GCSqGSIb3DQEBCwUAMDox
CzAJBgNVBAYTAnVzMQswCQYDVQQIDAJjYTEOMAwGA1UEBwwFbG9jYWwxDjAMBgNV
BAoMBXBsYWNlMB4XDTIzMTExMjIyNDEyN1oXDTI0MTExMTIyNDEyN1owOjELMAkG
A1UEBhMCdXMxCzAJBgNVBAgMAmNhMQ4wDAYDVQQHDAVsb2NhbDEOMAwGA1UECgwF
cGxhY2UwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCiSNBcvzzFg4DH
rva0PkByIdNRdOt+7zuq6N34vD/zjrjqZ3Hm5c5UMfurJU8/oJbfdNu3mb1wYfQ0
wW0SbUtGPSaN5hQJ4BxTYzVx4tNZjWn9c5ZDLpDl3pbTs1BNFw+4Ca4+YaxUm0Fi
HOL9V4HkzqxFIxYLEcpN/C9zgGVIUkPaDtgYgdpLttPRP/cSSdbwS+ZiBue8lhcD
YpiUIxPbgxcUirxAz0q1O+wKc3IZymwp42LUqWQHLjpDqbPu5Hc4HIvcYVA3C42h
Wzch6OGRwbFd3ME50YieM0lPv4E0VuskNGC2LmPfatAgROZzc6bF+Ddd6kWgmxL/
RqhDslVxZMKVrAO6G9zvgSw+C+smThFgPx/97qq7muuEdc6ny0+wdP8vp+bxYc0B
vuhCTXzArPrrySKdi0OPybnF30dorBJN1DcdLJM3dwsBljvyF05M+slpZbM4uTlU
4vNPDc3Z+sNLXQjENSnpRIlLA/8NjeZCkxr9yrZfKiOoLoddeymxKsyUyks0Hkdw
JqIOsCRwFn3YGM0hDwzAgd7bqz3AF93bZN1uIXCO52w4idDbrKPwgl6FFpGAKVnv
ot/BG7UmAkvSX7nbStssQSjmqWoQ4Xtos2+RG7GFSR43vV/UeRBN8UXt1TiYhWqk
x3hAokAooHy2l+zlIHVqk0HvzFGkqQIDAQABMA0GCSqGSIb3DQEBCwUAA4ICAQCW
wCizyL72Mp5JSt/SBpugTVgJny3BS7gIrc5rBbxwmh4wx4cOTqm1ejlQKM00vS36
lhh3vBAbQg+VR8HBCQTCgmoIxlvHvyF+QSkfLS2C/XHUFUlzN8R8QS2sYZKx/aC8
B7i97iqXdaqYjaWSRrg+JPLcsV9xHcfohbkde6NjWdMb48nb0jNW+WvUBx+Wl+Pu
r2m86aCv/fvlRGLL+2t8WGrFvtJXg00Mz/uZrruj7XNJgweNtZ16UuUHTZ+TIdiP
qXv5J1Ys5hqESX5fAadlgQWT3rgJENpJQdJHJICrf/uSDqevVfUoGzq3BeeFnPr/
URcgS9kJYHaIYxZwH8JOHuAq0bBU45nDipmrPIcE87CgZ5mV+yd1OI3p/Ko0DRnN
mlIlaSMiP/GxeK7/fIwuFTTxbkGmQgsBZasVZg/kLkBVDkCETDUzubiHoDI3JRUr
dQb6yrkJt9E6V/U/XAGnIGn2ENHbRRdlxZAU0BHMh5sywo/PoT8aDZknrSbrJnQ/
/mTe57Rr3WL9cJSiXnLoFBa6YkJZKI3aZoNvJ8ob05f7lInn1zz+9gjsIHuLx2aC
xh4tD+G9eyEnrxpo2tyIJT8Mlh5/PKV/X696vI3yKIIHsp7gIqVmqWNTmK9kPYzq
ZTzQYlzE5AO7wo2MN1E1pJ++6vEhto3taDhouCWTeQ==
-----END CERTIFICATE-----"""

MOCK_PRIVATE_KEY = b"""-----BEGIN PRIVATE KEY-----
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
60spDC9WjjzlFvoXZvtKOplaqmIx
-----END PRIVATE KEY-----"""

# Create a mock certificate
mock_cert = MagicMock(spec=x509.Certificate)
# Add necessary attributes to the mock certificate
mock_cert.serial_number = 123456789
mock_cert.not_valid_before = datetime.datetime(2020, 1, 1)
mock_cert.not_valid_after = datetime.datetime(2030, 1, 1)
mock_cert.not_valid_before_utc = datetime.datetime(2020, 1, 1)
mock_cert.not_valid_after_utc = datetime.datetime(2030, 1, 1)


def mock_file_side_effect(*args, **_kwargs):
    """Mock the open() function to return different data based on the filename."""
    filename = args[0]
    if "cert.pem" in filename:
        return mock_open(read_data=MOCK_CERTIFICATE)()
    elif "privkey.pem" in filename:
        return mock_open(read_data=MOCK_PRIVATE_KEY)()
    elif "chain.pem" in filename:
        return mock_open(read_data=b"data")()
    else:
        return mock_open(read_data="data")()


@pytest.fixture
def aws_mock():
    """Mock AWS services."""
    with mock_aws():
        yield


@mock_aws
@patch("certbot.main.main")
@patch("src.index.os.remove")
@patch("src.index.x509.load_pem_x509_certificate", return_value=mock_cert)
def test_provision_cert_creates_objects_correctly_for_s3_storage(
    _mock_load_pem, _mock_remove, mock_certbot_main
):
    """Test provisioning of SSL certificate with S3 storage."""
    # Configure mock
    mock_certbot_main.return_value = None

    mock_s3_client = boto3.client("s3")
    mock_s3_client.create_bucket(Bucket="example-cert-bucket")

    mock_sns_client = boto3.client("sns")
    mock_sns_client.create_topic(Name="example-topic")

    # Event details dont matter, function is triggered on
    # a schedule and uses env detailsI provi
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        index.handler(event, context)

    # Assert the mock was called with expected arguments
    mock_certbot_main.assert_called_once_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
        ]
    )

    response = mock_s3_client.list_objects_v2(Bucket="example-cert-bucket")
    objects = response.get("Contents", [])
    assert "cert.pem" in [obj["Key"] for obj in objects]
    obj = mock_s3_client.get_object(Bucket="example-cert-bucket", Key="cert.pem")
    body = obj["Body"].read()
    assert body == MOCK_CERTIFICATE
    assert "privkey.pem" in [obj["Key"] for obj in objects]
    obj = mock_s3_client.get_object(Bucket="example-cert-bucket", Key="privkey.pem")
    assert obj["Body"].read() == MOCK_PRIVATE_KEY
    assert "chain.pem" in [obj["Key"] for obj in objects]
    obj = mock_s3_client.get_object(Bucket="example-cert-bucket", Key="chain.pem")
    assert obj["Body"].read() == b"data"


def test_function_errors_if_storage_s3_and_bucket_not_given():
    """Test function errors if storage is S3 and bucket is not given."""
    del os.environ["CERTIFICATE_BUCKET"]

    # Event details dont matter, function is triggered on
    # a schedule and uses env detailsI provi
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        with pytest.raises(Exception) as e:
            index.handler(event, context)

    # assert that the index.handler function raised an exception
    # because the bucket was not provided
    assert "CERTIFICATE_BUCKET is not set" in str(e.value)


@mock_aws
@patch("certbot.main.main")
@patch("src.index.os.remove")
@patch("src.index.x509.load_pem_x509_certificate", return_value=mock_cert)
def test_provision_cert_creates_secrets_correctly_for_secretsmanager_storage(
    _mock_load_pem, _mock_remove, mock_certbot_main
):
    """Test provisioning of SSL certificate with Secrets Manager storage."""
    # Configure mock
    mock_certbot_main.return_value = None

    mock_sns_client = boto3.client("sns")
    mock_sns_client.create_topic(Name="example-topic")

    os.environ["CERTIFICATE_STORAGE"] = "secretsmanager"
    os.environ["CERTIFICATE_SECRET_PATH"] = "/example/path/"

    # Event details dont matter, function is triggered on
    # a schedule and uses env detailsI provi
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        index.handler(event, context)

    # Assert the mock was called with expected arguments
    mock_certbot_main.assert_called_once_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
        ]
    )

    # verify the secrets were created and contain the expected values
    secrets_client = boto3.client("secretsmanager")
    response = secrets_client.get_secret_value(SecretId="/example/path/cert.pem")
    assert response["SecretString"] == MOCK_CERTIFICATE.decode("utf-8")
    response = secrets_client.get_secret_value(SecretId="/example/path/privkey.pem")
    assert response["SecretString"] == MOCK_PRIVATE_KEY.decode("utf-8")
    response = secrets_client.get_secret_value(SecretId="/example/path/chain.pem")
    assert response["SecretString"] == "data"


def test_function_errors_if_storage_secretsmanager_and_path_not_given():
    """Test function errors if storage is Secrets Manager and path is not given."""
    os.environ["CERTIFICATE_STORAGE"] = "secretsmanager"
    del os.environ["CERTIFICATE_SECRET_PATH"]

    # Event details dont matter, function is triggered on
    # a schedule and uses env detailsI provi
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        with pytest.raises(Exception) as e:
            index.handler(event, context)

    # assert that the index.handler function raised an exception
    # because the bucket was not provided
    assert "CERTIFICATE_SECRET_PATH is not set" in str(e.value)


@mock_aws
@patch("certbot.main.main")
@patch("src.index.os.remove")
@patch("src.index.x509.load_pem_x509_certificate", return_value=mock_cert)
def test_provision_cert_behaves_correctly_for_ssm_storage(
    _mock_load_pem, _mock_remove, mock_certbot_main
):
    """Test provisioning of SSL certificate with SSM storage."""
    # Configure mock
    mock_certbot_main.return_value = None

    mock_sns_client = boto3.client("sns")
    mock_sns_client.create_topic(Name="example-topic")

    os.environ["CERTIFICATE_STORAGE"] = "ssm_secure"
    os.environ["CERTIFICATE_PARAMETER_PATH"] = "/example/path/"

    # Event details dont matter, function is triggered on
    # a schedule and uses env detailsI provi
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        index.handler(event, context)

    # Assert the mock was called with expected arguments
    mock_certbot_main.assert_called_once_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
        ]
    )

    # verify the secrets were created and contain the expected values
    ssm_client = boto3.client("ssm")
    response = ssm_client.get_parameter(
        Name="/example/path/cert.pem", WithDecryption=True
    )
    assert response["Parameter"]["Value"] == MOCK_CERTIFICATE.decode("utf-8")
    response = ssm_client.get_parameter(
        Name="/example/path/privkey.pem", WithDecryption=True
    )
    assert response["Parameter"]["Value"] == MOCK_PRIVATE_KEY.decode("utf-8")
    response = ssm_client.get_parameter(
        Name="/example/path/chain.pem", WithDecryption=True
    )
    assert response["Parameter"]["Value"] == "data"


def test_function_errors_if_storage_ssm_and_path_not_given():
    """Test function errors if storage is SSM and path is not given."""
    os.environ["CERTIFICATE_STORAGE"] = "ssm_secure"
    del os.environ["CERTIFICATE_PARAMETER_PATH"]

    # Event details dont matter, function is triggered on
    # a schedule and uses env details provided
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        with pytest.raises(Exception) as e:
            index.handler(event, context)

    # assert that the index.handler function raised an exception
    # because the bucket was not provided
    assert "CERTIFICATE_PARAMETER_PATH is not set" in str(e.value)


@mock_aws
@patch("certbot.main.main")
@patch("src.index.os.remove")
@patch("src.index.x509.load_pem_x509_certificate", return_value=mock_cert)
def test_provision_cert_behaves_correctly_for_efs_storage(
    _mock_load_pem, _mock_remove, mock_certbot_main
):
    """Test provisioning of SSL certificate with EFS storage."""
    # Configure mock
    mock_certbot_main.return_value = None

    mock_sns_client = boto3.client("sns")
    mock_sns_client.create_topic(Name="example-topic")

    os.environ["CERTIFICATE_STORAGE"] = "efs"

    # Create the EFS_PATH directory
    pathlib.Path(os.environ["EFS_PATH"] + "/").mkdir(parents=True, exist_ok=True)

    # Use just the first domain given if there are multiple
    domain_dir = (
        "/tmp/config-dir/live/" + os.environ["LETSENCRYPT_DOMAINS"].split(",")[0]
    )

    # Write the test data to real files since they are copied by path
    pathlib.Path(domain_dir).mkdir(parents=True, exist_ok=True)
    with open(domain_dir + "/cert.pem", "wb") as file:
        file.write(MOCK_CERTIFICATE)
    with open(domain_dir + "/privkey.pem", "wb") as file:
        file.write(MOCK_PRIVATE_KEY)
    with open(domain_dir + "/chain.pem", "wb") as file:
        file.write(b"data")

    # Event details dont matter, function is triggered on
    # a schedule and uses env details provided
    event = {}
    context = {}
    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        index.handler(event, context)

    # Assert the mock was called with expected arguments
    mock_certbot_main.assert_called_once_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
        ]
    )

    # verify the files were created and contain the expected values
    assert os.path.exists(os.environ["EFS_PATH"] + "/cert.pem")
    with open(os.environ["EFS_PATH"] + "/cert.pem", "rb") as file:
        contents = file.read()
        assert contents == MOCK_CERTIFICATE
    assert os.path.exists(os.environ["EFS_PATH"] + "/privkey.pem")
    with open(os.environ["EFS_PATH"] + "/privkey.pem", "rb") as file:
        contents = file.read()
        assert contents == MOCK_PRIVATE_KEY
    assert os.path.exists(os.environ["EFS_PATH"] + "/chain.pem")
    with open(os.environ["EFS_PATH"] + "/chain.pem", "rb") as file:
        contents = file.read()
        assert contents == b"data"


@patch("certbot.main.main")
def test_provision_cert_respects_dry_run_env_var(mock_certbot_main):
    """Test function respects DRY_RUN environment variable."""
    # Configure mock
    mock_certbot_main.return_value = None

    # Set dry run to skip file operations since we are
    # only testing the arguments passed to certbot
    os.environ["DRY_RUN"] = "True"

    # Event details dont matter, function is triggered on
    # a schedule and uses env details
    event = {}
    context = {}
    index.handler(event, context)

    # Assert the mock was called with expected arguments
    mock_certbot_main.assert_called_once_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
            "--dry-run",
        ]
    )

@mock_aws
@patch("certbot.main.main")
@patch("src.index.get_cert_info")
@patch("src.index.find_existing_cert")
@patch("src.index.upload_cert_to_acm")
def test_provision_reissues_if_san_changed(
    mock_upload_cert_to_acm, mock_find_existing_cert, mock_get_cert_info, mock_certbot_main
):
    """Test reprovisioning of SSL certificate when Subject Alternative Names (SANs) change."""

    # Configure mocks
    mock_certbot_main.return_value = None
    mock_get_cert_info.return_value = "Mocked certificate info"
    mock_upload_cert_to_acm.return_value = None

    mock_find_existing_cert.return_value = {
        "Certificate": {
            "CertificateArn": (
                "arn:aws:acm:region:123456789012:certificate/"
                "12345678-1234-1234-1234-123456789012"
            ),
            "DomainName": "example.com",
            "SubjectAlternativeNames": ["example.com"],
            "NotAfter": datetime.datetime(2030, 1, 1, tzinfo=datetime.timezone.utc),
        }
    }

    mock_s3_client = boto3.client("s3")
    mock_s3_client.create_bucket(Bucket="example-cert-bucket")

    mock_sns_client = boto3.client("sns")
    mock_sns_client.create_topic(Name="example-topic")

    # Event details dont matter, function is triggered on
    # a schedule and uses env details
    event = {}
    context = {}

    # Override the domains to include additional SANs
    # This should trigger a reissue since the mocked `find_existing_cert`
    # only returns a cert with the base domain and no SANs
    os.environ['LETSENCRYPT_DOMAINS'] = 'example.com, www.example.com, api.example.com'

    with patch("src.index.open", side_effect=mock_file_side_effect, create=True):
        index.handler(event, context)

    # Assert the mock was called (again) with expected arguments
    mock_certbot_main.assert_called_with(
        [
            "certonly",
            "-n",
            "--agree-tos",
            "--email",
            "email@example.com",
            "--dns-route53",
            "-d",
            "example.com, www.example.com, api.example.com",
            "--key-type",
            "ecdsa",
            "--config-dir",
            "/tmp/config-dir/",
            "--work-dir",
            "/tmp/work-dir/",
            "--logs-dir",
            "/tmp/logs-dir/",
            "--preferred-chain",
            "ISRG Root X1",
        ]
    )
