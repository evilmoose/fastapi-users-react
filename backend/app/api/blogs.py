from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.models.blog import BlogPost
from app.models.comment import BlogComment
from app.models.user import User
from app.schemas.blog import BlogPostCreate, BlogPostResponse
from app.schemas.comment import CommentCreate, CommentResponse
from app.api.users import current_active_user, is_admin

router = APIRouter()

@router.get("/", response_model=List[BlogPostResponse])
async def get_blog_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).order_by(BlogPost.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=BlogPostResponse)
async def create_blog_post(
    post: BlogPostCreate, 
    user: User = Depends(current_active_user), 
    is_admin: bool = Depends(is_admin),
    db: AsyncSession = Depends(get_db)
):
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create blog posts"
        )
    
    blog_post = BlogPost(**post.model_dump())
    db.add(blog_post)
    await db.commit()
    await db.refresh(blog_post)
    return blog_post

@router.get("/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(post_id: int, db: AsyncSession = Depends(get_db)):
    post = await db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/comments/", response_model=CommentResponse)
async def create_comment(
    comment_in: CommentCreate, user: User = Depends(current_active_user), db: AsyncSession = Depends(get_db)
):
    comment = BlogComment(**comment_in.model_dump(), user_id=user.id)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return {"user_name": user.email, **comment.__dict__}

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: int, 
    skip: int = 0, 
    limit: int = 50, 
    db: AsyncSession = Depends(get_db)
):
    # First, get all comments for this post
    result = await db.execute(
        select(BlogComment, User.email.label("user_name"))
        .join(User, BlogComment.user_id == User.id)
        .filter(BlogComment.post_id == post_id)
        .order_by(BlogComment.created_at.asc())
    )
    comments = result.all()
    
    # Create a map of all comments
    comment_map = {}
    for comment in comments:
        comment_dict = {
            "user_name": comment.user_name,
            **comment.BlogComment.__dict__,
            "replies": []
        }
        comment_map[comment_dict["id"]] = comment_dict

    # Organize comments into hierarchy
    root_comments = []
    for comment_id, comment in comment_map.items():
        if comment["parent_id"] is None:
            # This is a root comment
            root_comments.append(comment)
        else:
            # This is a reply
            parent = comment_map.get(comment["parent_id"])
            if parent:
                # If the parent's parent is None, this is a second-level comment
                # Otherwise, it belongs to the thread of its grandparent
                grandparent_id = parent.get("parent_id")
                if grandparent_id is None:
                    # Second level - add directly to parent
                    parent["replies"].append(comment)
                else:
                    # Third level - add to the thread under the original parent comment
                    grandparent = comment_map.get(grandparent_id)
                    if grandparent:
                        # Find the correct second-level comment
                        for reply in grandparent["replies"]:
                            if reply["id"] == comment["parent_id"]:
                                reply["replies"].append(comment)
                                break

    # Apply skip and limit to root comments
    paginated_comments = root_comments[skip:skip + limit]
    return paginated_comments

@router.put("/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: int,
    post: BlogPostCreate,
    user: User = Depends(current_active_user),
    is_admin: bool = Depends(is_admin),
    db: AsyncSession = Depends(get_db)
):
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update blog posts"
        )
    
    db_post = await db.get(BlogPost, post_id)
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    for key, value in post.model_dump().items():
        setattr(db_post, key, value)
    
    await db.commit()
    await db.refresh(db_post)
    return db_post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: int,
    user: User = Depends(current_active_user),
    is_admin: bool = Depends(is_admin),
    db: AsyncSession = Depends(get_db)
):
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete blog posts"
        )
    
    post = await db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    await db.delete(post)
    await db.commit()