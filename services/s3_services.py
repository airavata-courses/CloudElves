import logging
import os

import boto3
from botocore.exceptions import ClientError


logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class S3Service:
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name
        self.region = os.getenv('region') or 'us-east-1'
        self.aws_access_key_id = os.getenv('aws_access_key_id') or 'accessKey1'
        self.aws_secret_access_key = os.getenv('aws_secret_access_key') or 'verySecretKey1'
        self.endpoint_url = os.getenv('s3_endpoint_url') or 'http://149.165.157.38:30042'
        self.s3_client = boto3.client('s3', aws_access_key_id=self.aws_access_key_id, aws_secret_access_key=self.aws_secret_access_key,
                                      region_name=self.region, endpoint_url=self.endpoint_url)
        if not self.is_bucket_available():
            log.info("bucket {} does not exist, creating..".format(self.bucket_name))
            self.create_bucket()

    def is_bucket_available(self):
        all_buckets = self.s3_client.list_buckets()
        for bucket in all_buckets['Buckets']:
            if self.bucket_name == bucket['Name']:
                return True
        return False

    def create_bucket(self):
        try:
            if self.region is None:
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            else:
                location = {'LocationConstraint': self.region}
                self.s3_client.create_bucket(Bucket=self.bucket_name, CreateBucketConfiguration=location)
        except ClientError as e:
            errorMessage = 'error while listing buckets: {}'.format(e)
            log.info(errorMessage)
            raise Exception(e)

    def list_existing_buckets(self):
        try:
            response = self.s3_client.list_buckets()
            for bucket in response['Buckets']:
                log.info(f' {bucket["Name"]}')
        except FileNotFoundError as e:
            errorMessage = 'error while listing buckets: {}'.format(e)
            log.info(errorMessage)
            raise Exception(e)

    def list_all_bucket_files(self):
        files = []
        try:
            objects = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            for obj in objects['Contents']:
                files.append(obj['Key'])
        except FileExistsError as e:
            errorMessage = "error while listing files in the Bucket: {} - {}".format(self.bucket_name, e)
            log.info(errorMessage)
            raise Exception(errorMessage)
        return files

    def upload_file(self, file_name, object_name=None):
        if object_name is None:
            object_name = os.path.basename(file_name)
        try:
            response = self.s3_client.upload_file(file_name, self.bucket_name, object_name)
            log.info('successfully uploaded file {} with s3 key: {}'.format(file_name, object_name))
        except ClientError as e:
            errorMessage = 'error while uploading the file {} to bucket {}: {}'.format(file_name, self.bucket_name, e)
            log.info(errorMessage)
            raise Exception(errorMessage)

    def download_file(self, file_name, download_path):
        try:
            log.info('downloading s3 key {} to local path {}'.format(file_name, download_path))
            self.s3_client.download_file(self.bucket_name, file_name, download_path)
        except ClientError as e:
            errorMessage = "error while downloading the file {} from bucket {}: {}".format(file_name, self.bucket_name, e)
            log.info(errorMessage)
            raise Exception(errorMessage)

    def delete_file(self, file_name):
        try:
            self.delete_file(file_name)
        except ClientError as e:
            errorMessage = "error while deleting the file {} from bucket {}: {}".format(file_name, self.bucket_name, e)
            log.info(errorMessage)
            raise Exception(errorMessage)

    def download_all_files(self):
        files_in_bucket = self.list_all_bucket_files()
        try:
            for f in files_in_bucket:
                self.download_file(f)
        except ClientError as e:
            logging.error(e)
            raise Exception(" Error while all file from bucket{}: {}".format(self.bucket_name, e.val))
        return "All files downloaded successfully from bucket " + self.bucket_name
