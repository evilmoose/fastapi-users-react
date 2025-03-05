"""
Replicate service for processing OCR results.
"""

import os
import json
import logging
import replicate
from typing import Dict, Any

logger = logging.getLogger(__name__)


class LangChainProcessor:
    """Processor for OCR results using Replicate API directly."""

    def __init__(self):
        """Initialize processor."""
        self.api_token = os.getenv("REPLICATE_API_TOKEN")
        self.model_name = os.getenv("REPLICATE_MODEL_NAME", "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3")

    def process_ocr_text(self, text: str) -> Dict[str, Any]:
        """
        Process OCR text using Replicate API directly.
        
        Args:
            text: The OCR text to process
            
        Returns:
            The processed structured data
        """
        try:
            # Create a prompt for extracting structured data
            prompt = f"""
            You are an AI assistant that extracts structured information from OCR text.
            
            Extract all relevant information from the following OCR text and organize it into a structured JSON format.
            Focus on key fields like names, dates, addresses, amounts, and any other important information.
            
            OCR Text:
            {text}
            
            Return ONLY a valid JSON object with the extracted information. Do not include any explanations or text outside the JSON.
            """
            
            # Call Replicate API
            output = replicate.run(
                self.model_name,
                input={
                    "prompt": prompt,
                    "temperature": 0.1,
                    "max_length": 2000,
                    "top_p": 0.9
                }
            )
            
            # Join the output stream into a single string
            result = "".join(output)
            
            # Clean up the result to ensure it's valid JSON
            result = result.strip()
            if result.startswith("```json"):
                result = result[7:]
            if result.endswith("```"):
                result = result[:-3]
            
            # Parse the result as JSON
            try:
                structured_data = json.loads(result.strip())
                return structured_data
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing LLM output as JSON: {e}")
                logger.error(f"Raw output: {result}")
                return {"error": "Failed to parse structured data", "raw_text": text}
                
        except Exception as e:
            logger.error(f"Error processing OCR text with Replicate: {e}")
            return {"error": str(e), "raw_text": text} 