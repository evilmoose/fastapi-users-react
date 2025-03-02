"""
Pydantic schemas for lead API.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LeadBase(BaseModel):
    """Base schema for lead data."""
    
    name: str = Field(..., min_length=2, max_length=100, description="Full name of the lead")
    email: EmailStr = Field(..., description="Email address of the lead")
    company: Optional[str] = Field(None, max_length=100, description="Company name")
    business_need: Optional[str] = Field(None, description="Description of business needs")


class LeadCreate(LeadBase):
    """Schema for creating a new lead."""
    pass


class LeadResponse(LeadBase):
    """Schema for lead response."""
    
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        """Pydantic config."""
        
        from_attributes = True 