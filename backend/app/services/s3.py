"""
S3 service for handling file uploads and downloads.
"""

import os
import uuid
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)


class S3Service:
    """S3 service for handling file uploads and downloads."""

    def __init__(self):
        """Initialize S3 service."""
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                region_name=os.getenv('AWS_REGION', 'us-east-1')
            )
            self.bucket_name = os.getenv('S3_BUCKET_NAME')
            
            if not self.bucket_name:
                logger.warning("S3_BUCKET_NAME environment variable is not set")
                
            logger.info(f"S3Service initialized with bucket: {self.bucket_name}")
        except Exception as e:
            logger.error(f"Error initializing S3 service: {e}")
            raise

    async def upload_file(self, file: UploadFile, prefix: str = 'uploads') -> str:
        """
        Upload a file to S3.
        
        Args:
            file: The file to upload
            prefix: The prefix to use for the S3 key
            
        Returns:
            The S3 key of the uploaded file
        """
        if not file:
            logger.error("No file provided for upload")
            raise HTTPException(status_code=400, detail="No file provided")
            
        if not file.filename:
            logger.error("File has no filename")
            raise HTTPException(status_code=400, detail="File has no filename")
            
        try:
            # Generate a unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            s3_key = f"{prefix}/{unique_filename}"
            
            logger.info(f"Preparing to upload file: {file.filename} to {s3_key}")
            
            # Read file content
            file_content = await file.read()
            
            if not file_content:
                logger.error("File content is empty")
                raise HTTPException(status_code=400, detail="File content is empty")
                
            file_size = len(file_content)
            logger.info(f"File size: {file_size} bytes")
            
            # Upload to S3
            logger.info(f"Uploading to S3 bucket: {self.bucket_name}")
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_content,
                ContentType=file.content_type
            )
            
            # Reset file cursor for potential further use
            await file.seek(0)
            
            logger.info(f"File successfully uploaded to S3: {s3_key}")
            return s3_key
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            logger.error(f"S3 ClientError ({error_code}): {error_message}")
            raise HTTPException(status_code=500, detail=f"S3 upload error: {error_message}")
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            logger.error(f"Unexpected error uploading file to S3: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

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
            logger.info(f"Generating presigned URL for: {s3_key}")
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )
            logger.info(f"Presigned URL generated successfully")
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate file access URL")

    async def delete_file(self, s3_key: str) -> bool:
        """
        Delete a file from S3.
        
        Args:
            s3_key: The S3 key of the file
            
        Returns:
            True if the file was deleted, False otherwise
        """
        try:
            logger.info(f"Deleting file from S3: {s3_key}")
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
            logger.info(f"File deleted successfully from S3: {s3_key}")
            return True
        except ClientError as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting file from S3: {str(e)}", exc_info=True)
            return False 