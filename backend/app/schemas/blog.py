from datetime import datetime
from pydantic import BaseModel, Field

class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    content: str = Field(..., min_length=10)

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True