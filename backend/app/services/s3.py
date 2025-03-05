"""
S3 service for handling file uploads and downloads.
"""

import os
import uuid
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)


class S3Service:
    """S3 service for handling file uploads and downloads."""

    def __init__(self):
        """Initialize S3 service."""
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.bucket_name = os.getenv('S3_BUCKET_NAME')

    async def upload_file(self, file: UploadFile, prefix: str = 'uploads') -> str:
        """
        Upload a file to S3.
        
        Args:
            file: The file to upload
            prefix: The prefix to use for the S3 key
            
        Returns:
            The S3 key of the uploaded file
        """
        try:
            # Generate a unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            s3_key = f"{prefix}/{unique_filename}"
            
            # Read file content
            file_content = await file.read()
            
            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_content,
                ContentType=file.content_type
            )
            
            # Reset file cursor for potential further use
            await file.seek(0)
            
            return s3_key
        except ClientError as e:
            logger.error(f"Error uploading file to S3: {e}")
            raise

    def generate_presigned_url(self, s3_key: str, expiration: int = 3600) -> str:
        """
        Generate a presigned URL for accessing a file in S3.
        
        Args:
            s3_key: The S3 key of the file
            expiration: The expiration time in seconds
            
        Returns:
            The presigned URL
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            raise

    def delete_file(self, s3_key: str) -> bool:
        """
        Delete a file from S3.
        
        Args:
            s3_key: The S3 key of the file
            
        Returns:
            True if the file was deleted, False otherwise
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
            return True
        except ClientError as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False 