"""
PDF document schemas.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class PDFDocumentBase(BaseModel):
    """Base PDF document schema."""
    filename: str


class PDFDocumentCreate(PDFDocumentBase):
    """PDF document create schema."""
    pass


class PDFDocumentUpdate(BaseModel):
    """PDF document update schema."""
    ocr_data: Optional[Dict[str, Any]] = None


class BoundingBox(BaseModel):
    """Bounding box schema for OCR results."""
    x: float
    y: float
    width: float
    height: float
    page: int
    text: str
    confidence: float


class OCRResult(BaseModel):
    """OCR result schema."""
    text: str
    bounding_boxes: List[BoundingBox]
    structured_data: Optional[Dict[str, Any]] = None


class PDFDocumentResponse(PDFDocumentBase):
    """PDF document response schema."""
    id: int
    user_id: int
    file_url: str
    ocr_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        """Pydantic config."""
        from_attributes = True 