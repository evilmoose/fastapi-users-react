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

from app.core.db import get_db, async_session_factory
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
    db: AsyncSession = None  # Make db parameter optional
):
    """
    Process a PDF in the background.
    
    Args:
        pdf_id: The ID of the PDF document
        s3_key: The S3 key of the PDF
        db: The database session (optional)
    """
    try:
        # Get OCR results from Textract
        ocr_result = textract_service.analyze_document(
            s3_bucket=os.getenv('S3_BUCKET_NAME'),
            s3_key=s3_key
        )
        
        # Check if the OCR result already contains an error
        if ocr_result.structured_data and "error" in ocr_result.structured_data:
            logger.warning(f"OCR processing error for PDF {pdf_id}: {ocr_result.structured_data['error']}")
            
            # Update the PDF document with the error
            max_retries = 3
            retry_count = 0
            success = False
            
            while retry_count < max_retries and not success:
                try:
                    async with async_session_factory() as session:
                        await session.execute(
                            update(PDFDocument)
                            .where(PDFDocument.id == pdf_id)
                            .values(
                                ocr_data=ocr_result.structured_data
                            )
                        )
                        await session.commit()
                        success = True
                        logger.info(f"Updated PDF {pdf_id} with OCR error information")
                except Exception as db_error:
                    retry_count += 1
                    logger.warning(f"Database update failed (attempt {retry_count}/{max_retries}): {db_error}")
                    if retry_count >= max_retries:
                        raise db_error
            return
        
        # Process OCR text with LangChain
        structured_data = langchain_processor.process_ocr_text(ocr_result.text)
        
        # Update the PDF document with extracted data
        # Use a fresh session to avoid connection issues
        max_retries = 3
        retry_count = 0
        success = False
        
        while retry_count < max_retries and not success:
            try:
                async with async_session_factory() as session:
                    await session.execute(
                        update(PDFDocument)
                        .where(PDFDocument.id == pdf_id)
                        .values(
                            ocr_data={
                                "text": ocr_result.text,
                                "structured_data": structured_data,
                                "bounding_boxes": [box.dict() for box in ocr_result.bounding_boxes]
                            }
                        )
                    )
                    await session.commit()
                    success = True
                    logger.info(f"Successfully processed PDF {pdf_id}")
            except Exception as db_error:
                retry_count += 1
                logger.warning(f"Database update failed (attempt {retry_count}/{max_retries}): {db_error}")
                if retry_count >= max_retries:
                    raise db_error
            
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        # Update the PDF document with error - use a fresh session
        try:
            async with async_session_factory() as session:
                await session.execute(
                    update(PDFDocument)
                    .where(PDFDocument.id == pdf_id)
                    .values(
                        ocr_data={"error": str(e)}
                    )
                )
                await session.commit()
                logger.info(f"Updated PDF {pdf_id} with error information")
        except Exception as update_error:
            logger.error(f"Failed to update PDF {pdf_id} with error information: {update_error}")


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
    # Log request information
    logger.info(f"PDF upload request received: filename={file.filename}, content_type={file.content_type}, size={file.size}")
    
    # Validate file type
    if not file.content_type == "application/pdf":
        logger.warning(f"Invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Upload file to S3
        logger.info(f"Uploading file to S3: {file.filename}")
        s3_key = await s3_service.upload_file(file, prefix="pdfs")
        logger.info(f"File uploaded to S3: {s3_key}")
        
        # Create PDF document in database
        logger.info(f"Creating PDF document in database for user {current_user.id}")
        pdf_document = PDFDocument(
            user_id=current_user.id,
            filename=file.filename,  # Use the original filename
            file_url=s3_key,  # Store the S3 key in file_url
            ocr_data=None  # Initialize OCR data as None
        )
        
        # Add to session and commit with retry logic
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                logger.info(f"Committing PDF document to database (attempt {retry_count + 1}/{max_retries})")
                db.add(pdf_document)
                await db.commit()
                await db.refresh(pdf_document)
                logger.info(f"PDF document committed to database: id={pdf_document.id}")
                break
            except Exception as e:
                retry_count += 1
                logger.warning(f"Database commit failed (attempt {retry_count}/{max_retries}): {e}")
                await db.rollback()
                if retry_count >= max_retries:
                    # If we've exhausted retries, re-raise the exception
                    raise
        
        # Process PDF in background with a fresh database session
        # Store only the ID and S3 key, not the session
        logger.info(f"Adding background task to process PDF: id={pdf_document.id}")
        background_tasks.add_task(
            process_pdf_background,
            pdf_document.id,
            s3_key,
            None  # Don't pass the db session to avoid connection issues
        )
        
        logger.info(f"PDF upload successful: id={pdf_document.id}")
        return pdf_document
    except Exception as e:
        logger.error(f"Error uploading PDF: {str(e)}", exc_info=True)
        # Delete the file from S3 if it was uploaded but database operation failed
        try:
            if 's3_key' in locals():
                logger.info(f"Cleaning up S3 file after error: {s3_key}")
                success = await s3_service.delete_file(s3_key)
                if success:
                    logger.info(f"Cleaned up S3 file {s3_key} after error")
                else:
                    logger.warning(f"Failed to clean up S3 file {s3_key} after error")
        except Exception as cleanup_error:
            logger.error(f"Error cleaning up S3 file: {cleanup_error}")
        
        raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")


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
        url = s3_service.generate_presigned_url(pdf.file_url)
        
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
        logger.info(f"Delete PDF request received: pdf_id={pdf_id}, user_id={current_user.id}")
        
        result = await db.execute(
            select(PDFDocument)
            .where(PDFDocument.id == pdf_id, PDFDocument.user_id == current_user.id)
        )
        pdf = result.scalars().first()
        
        if not pdf:
            logger.warning(f"PDF not found: pdf_id={pdf_id}, user_id={current_user.id}")
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Delete from S3
        logger.info(f"Deleting PDF from S3: s3_key={pdf.file_url}")
        success = await s3_service.delete_file(pdf.file_url)
        
        if not success:
            logger.warning(f"Failed to delete PDF from S3: s3_key={pdf.file_url}")
            # Continue with database deletion even if S3 deletion fails
        
        # Delete from database
        logger.info(f"Deleting PDF from database: pdf_id={pdf_id}")
        await db.delete(pdf)
        await db.commit()
        
        logger.info(f"PDF deleted successfully: pdf_id={pdf_id}")
        return {"message": "PDF deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete PDF: {str(e)}")


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
        
        if not pdf.ocr_data:
            raise HTTPException(status_code=404, detail="OCR results not available yet")
        
        # Extract OCR results
        bounding_boxes = [
            BoundingBox(**box) 
            for box in pdf.ocr_data.get("bounding_boxes", [])
        ]
        
        return OCRResult(
            text=pdf.ocr_data.get("text", ""),
            bounding_boxes=bounding_boxes,
            structured_data=pdf.ocr_data.get("structured_data", {})
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PDF OCR: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 