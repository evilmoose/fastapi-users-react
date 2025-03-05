"""
PDF API endpoints.
"""

import os
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update

from app.core.db import get_db
from app.models.pdf import PDFDocument
from app.schemas.pdf import PDFDocumentResponse, OCRResult
from app.services.s3 import S3Service
from app.services.textract import TextractService
from app.services.langchain_processor import LangChainProcessor
from app.api.users import current_active_user
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
s3_service = S3Service()
textract_service = TextractService()
langchain_processor = LangChainProcessor()


async def process_pdf_background(
    pdf_id: int,
    s3_key: str,
    db: AsyncSession
):
    """
    Process a PDF in the background.
    
    Args:
        pdf_id: The ID of the PDF document
        s3_key: The S3 key of the PDF
        db: The database session
    """
    try:
        # Get OCR results from Textract
        ocr_result = textract_service.analyze_document(
            s3_bucket=os.getenv('S3_BUCKET_NAME'),
            s3_key=s3_key
        )
        
        # Process OCR text with LangChain
        structured_data = langchain_processor.process_ocr_text(ocr_result.text)
        
        # Update the PDF document with extracted data
        async with db as session:
            await session.execute(
                update(PDFDocument)
                .where(PDFDocument.id == pdf_id)
                .values(
                    extracted_text=ocr_result.text,
                    extracted_data={
                        "structured_data": structured_data,
                        "bounding_boxes": [box.dict() for box in ocr_result.bounding_boxes]
                    }
                )
            )
            await session.commit()
            
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        # Update the PDF document with error
        async with db as session:
            await session.execute(
                update(PDFDocument)
                .where(PDFDocument.id == pdf_id)
                .values(
                    extracted_data={"error": str(e)}
                )
            )
            await session.commit()


@router.post("/upload", response_model=PDFDocumentResponse)
async def upload_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a PDF document.
    
    Args:
        background_tasks: FastAPI background tasks
        file: The PDF file to upload
        current_user: The current user
        db: The database session
        
    Returns:
        The uploaded PDF document
    """
    # Validate file type
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Upload file to S3
        s3_key = await s3_service.upload_file(file, prefix="pdfs")
        
        # Create PDF document in database
        pdf_document = PDFDocument(
            user_id=current_user.id,
            filename=s3_key.split("/")[-1],
            s3_key=s3_key,
            original_filename=file.filename,
            content_type=file.content_type,
            file_size=file.size
        )
        
        db.add(pdf_document)
        await db.commit()
        await db.refresh(pdf_document)
        
        # Process PDF in background
        background_tasks.add_task(
            process_pdf_background,
            pdf_document.id,
            s3_key,
            db
        )
        
        return pdf_document
    except Exception as e:
        logger.error(f"Error uploading PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[PDFDocumentResponse])
async def get_pdfs(
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all PDF documents for the current user.
    
    Args:
        current_user: The current user
        db: The database session
        
    Returns:
        The list of PDF documents
    """
    try:
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.user_id == current_user.id)
            .order_by(PDFDocument.created_at.desc())
        )
        pdfs = result.scalars().all()
        return pdfs
    except Exception as e:
        logger.error(f"Error getting PDFs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{pdf_id}", response_model=PDFDocumentResponse)
async def get_pdf(
    pdf_id: int,
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a PDF document by ID.
    
    Args:
        pdf_id: The ID of the PDF document
        current_user: The current user
        db: The database session
        
    Returns:
        The PDF document
    """
    try:
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.id == pdf_id, PDFDocument.user_id == current_user.id)
        )
        pdf = result.scalars().first()
        
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        return pdf
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{pdf_id}/url")
async def get_pdf_url(
    pdf_id: int,
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a presigned URL for a PDF document.
    
    Args:
        pdf_id: The ID of the PDF document
        current_user: The current user
        db: The database session
        
    Returns:
        The presigned URL
    """
    try:
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.id == pdf_id, PDFDocument.user_id == current_user.id)
        )
        pdf = result.scalars().first()
        
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Generate presigned URL
        url = s3_service.generate_presigned_url(pdf.s3_key)
        
        return {"url": url}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PDF URL: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{pdf_id}")
async def delete_pdf(
    pdf_id: int,
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a PDF document.
    
    Args:
        pdf_id: The ID of the PDF document
        current_user: The current user
        db: The database session
        
    Returns:
        Success message
    """
    try:
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.id == pdf_id, PDFDocument.user_id == current_user.id)
        )
        pdf = result.scalars().first()
        
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Delete from S3
        s3_service.delete_file(pdf.s3_key)
        
        # Delete from database
        await db.delete(pdf)
        await db.commit()
        
        return {"message": "PDF deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{pdf_id}/ocr", response_model=OCRResult)
async def get_pdf_ocr(
    pdf_id: int,
    current_user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get OCR results for a PDF document.
    
    Args:
        pdf_id: The ID of the PDF document
        current_user: The current user
        db: The database session
        
    Returns:
        The OCR results
    """
    try:
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.id == pdf_id, PDFDocument.user_id == current_user.id)
        )
        pdf = result.scalars().first()
        
        if not pdf:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        if not pdf.extracted_data:
            raise HTTPException(status_code=404, detail="OCR results not available yet")
        
        # Extract OCR results
        bounding_boxes = [
            BoundingBox(**box) 
            for box in pdf.extracted_data.get("bounding_boxes", [])
        ]
        
        return OCRResult(
            text=pdf.extracted_text or "",
            bounding_boxes=bounding_boxes,
            structured_data=pdf.extracted_data.get("structured_data", {})
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PDF OCR: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 