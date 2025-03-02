"""
API endpoints for lead management.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.models.lead import Lead
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadResponse
from app.api.users import current_active_user, current_superuser


router = APIRouter()


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_in: LeadCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new lead submission.
    
    This endpoint is public and does not require authentication.
    """
    lead = Lead(**lead_in.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


@router.get("/", response_model=List[LeadResponse])
async def get_leads(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_superuser),
):
    """
    Retrieve all leads.
    
    This endpoint requires superuser privileges.
    """
    result = await db.execute(select(Lead).offset(skip).limit(limit))
    leads = result.scalars().all()
    return leads


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user),
):
    """
    Retrieve a specific lead by ID.
    
    This endpoint requires authentication.
    """
    result = await db.execute(select(Lead).filter(Lead.id == lead_id))
    lead = result.scalars().first()
    
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )
    
    return lead 