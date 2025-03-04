from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None

class CommentResponse(CommentBase):
    id: int
    post_id: int
    user_id: int
    user_name: str
    parent_id: Optional[int]
    created_at: datetime
    replies: List['CommentResponse'] = []

    class Config:
        from_attributes = True

# This is needed for the self-referential type hint to work
CommentResponse.model_rebuild()