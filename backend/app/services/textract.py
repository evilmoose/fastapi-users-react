"""
AWS Textract service for OCR processing.
"""

import os
import boto3
import logging
from typing import Dict, Any, List
from botocore.exceptions import ClientError
from app.schemas.pdf import BoundingBox, OCRResult

logger = logging.getLogger(__name__)


class TextractService:
    """AWS Textract service for OCR processing."""

    def __init__(self):
        """Initialize Textract service."""
        self.textract_client = boto3.client(
            'textract',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )

    def analyze_document(self, s3_bucket: str, s3_key: str) -> OCRResult:
        """
        Analyze a document using AWS Textract.
        
        Args:
            s3_bucket: The S3 bucket containing the document
            s3_key: The S3 key of the document
            
        Returns:
            The OCR result
        """
        try:
            # Call Textract to analyze the document
            response = self.textract_client.analyze_document(
                Document={
                    'S3Object': {
                        'Bucket': s3_bucket,
                        'Name': s3_key
                    }
                },
                FeatureTypes=['TABLES', 'FORMS']
            )
            
            # Process the response
            return self._process_textract_response(response)
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', '')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            
            logger.error(f"AWS Textract error: {error_code} - {error_message}")
            
            if 'UnsupportedDocumentException' in str(e):
                # Create an OCR result with error information
                return OCRResult(
                    text="",
                    bounding_boxes=[],
                    structured_data={
                        "error": f"An error occurred (UnsupportedDocumentException) when calling the AnalyzeDocument operation: Request has unsupported document format"
                    }
                )
            raise
        except Exception as e:
            logger.error(f"Error analyzing document with Textract: {e}")
            raise

    def _process_textract_response(self, response: Dict[str, Any]) -> OCRResult:
        """
        Process the Textract response.
        
        Args:
            response: The Textract response
            
        Returns:
            The processed OCR result
        """
        blocks = response.get('Blocks', [])
        full_text = ""
        bounding_boxes = []
        
        # Process each block
        for block in blocks:
            if block['BlockType'] == 'LINE':
                text = block.get('Text', '')
                full_text += text + "\n"
                
                # Get bounding box information
                if 'Geometry' in block and 'BoundingBox' in block['Geometry']:
                    bbox = block['Geometry']['BoundingBox']
                    bounding_boxes.append(
                        BoundingBox(
                            x=bbox['Left'],
                            y=bbox['Top'],
                            width=bbox['Width'],
                            height=bbox['Height'],
                            page=1,  # Assuming single page for simplicity
                            text=text,
                            confidence=block.get('Confidence', 0.0)
                        )
                    )
        
        # Create structured data from form fields
        structured_data = self._extract_form_data(blocks)
        
        return OCRResult(
            text=full_text,
            bounding_boxes=bounding_boxes,
            structured_data=structured_data
        )

    def _extract_form_data(self, blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extract form data from Textract blocks.
        
        Args:
            blocks: The Textract blocks
            
        Returns:
            The extracted form data
        """
        form_data = {}
        block_map = {block['Id']: block for block in blocks}
        
        # Find key-value pairs
        for block_id, block in block_map.items():
            if block['BlockType'] == 'KEY_VALUE_SET' and block.get('EntityTypes', []) == ['KEY']:
                key_block = block
                
                # Get the key text
                key_text = ""
                if 'Relationships' in key_block:
                    for relationship in key_block['Relationships']:
                        if relationship['Type'] == 'CHILD':
                            for child_id in relationship['Ids']:
                                child_block = block_map[child_id]
                                if child_block['BlockType'] == 'WORD':
                                    key_text += child_block.get('Text', '') + " "
                
                key_text = key_text.strip()
                
                # Get the value
                value_text = ""
                if 'Relationships' in key_block:
                    for relationship in key_block['Relationships']:
                        if relationship['Type'] == 'VALUE':
                            for value_id in relationship['Ids']:
                                value_block = block_map[value_id]
                                
                                if 'Relationships' in value_block:
                                    for value_relationship in value_block['Relationships']:
                                        if value_relationship['Type'] == 'CHILD':
                                            for child_id in value_relationship['Ids']:
                                                child_block = block_map[child_id]
                                                if child_block['BlockType'] == 'WORD':
                                                    value_text += child_block.get('Text', '') + " "
                
                value_text = value_text.strip()
                
                # Add to form data
                if key_text and value_text:
                    form_data[key_text] = value_text
        
        return form_data 