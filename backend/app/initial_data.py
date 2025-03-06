"""
Script to initialize database tables and create a superuser.
"""

import asyncio
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set the DATABASE_URL environment variable explicitly before importing any modules
os.environ["DATABASE_URL"] = os.getenv("DATABASE_URL")

from fastapi_users.exceptions import UserAlreadyExists
from fastapi_users.db import SQLAlchemyUserDatabase
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
import asyncpg

from app.api.users import get_user_manager, UserManager
from app.core.db import Base, engine, async_session_factory
from app.models.user import User
# Import all models to ensure they're registered with Base.metadata
from app.models.pdf import PDFDocument
from app.models.lead import Lead
from app.models.blog import BlogPost
from app.main import UserCreate
from app.core.config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_tables():
    """Create database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Tables created")


async def recreate_users_table():
    """Drop and recreate the users table with the correct schema."""
    try:
        # Convert SQLAlchemy URL format to asyncpg format
        asyncpg_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        conn = await asyncpg.connect(asyncpg_url)
        
        # Drop the existing users table
        logger.info("Dropping existing users table...")
        await conn.execute("DROP TABLE IF EXISTS users CASCADE")
        
        # Create the users table with the correct schema
        logger.info("Creating users table with correct schema...")
        await conn.execute("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(320) NOT NULL UNIQUE,
            hashed_password VARCHAR(1024) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
            is_verified BOOLEAN NOT NULL DEFAULT FALSE,
            first_name VARCHAR(50),
            last_name VARCHAR(50)
        )
        """)
        
        # Create an index on the email column
        await conn.execute("CREATE INDEX ix_users_email ON users (email)")
        
        logger.info("Users table recreated successfully")
        await conn.close()
    except Exception as e:
        logger.error(f"Error recreating users table: {e}")


async def debug_database():
    """Debug database connection and structure."""
    logger.info(f"Database URL: {settings.DATABASE_URL}")
    logger.info(f"Environment DATABASE_URL: {os.environ.get('DATABASE_URL')}")
    
    try:
        # Convert SQLAlchemy URL format to asyncpg format
        # Replace postgresql+asyncpg:// with postgresql://
        asyncpg_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        logger.info(f"Connecting with asyncpg using: {asyncpg_url}")
        
        # Connect directly with asyncpg to check table structure
        conn = await asyncpg.connect(asyncpg_url)
        
        # Check if users table exists
        table_check = await conn.fetch(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
        )
        logger.info(f"Users table exists: {table_check[0]['exists']}")
        
        # Check if documents table exists
        pdf_table_check = await conn.fetch(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents')"
        )
        logger.info(f"Documents table exists: {pdf_table_check[0]['exists']}")
        
        # Check columns in users table
        columns = await conn.fetch(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
        )
        logger.info("Users table columns:")
        for col in columns:
            logger.info(f"  {col['column_name']} - {col['data_type']}")
            
        # Check columns in documents table
        doc_columns = await conn.fetch(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'documents'"
        )
        logger.info("Documents table columns:")
        for col in doc_columns:
            logger.info(f"  {col['column_name']} - {col['data_type']}")
        
        await conn.close()
    except Exception as e:
        logger.error(f"Error debugging database: {e}")


async def create_superuser():
    """Create a superuser if it doesn't exist."""
    try:
        # Create a session
        async with async_session_factory() as session:
            # Create user database
            user_db = SQLAlchemyUserDatabase(session, User)
            
            # Create user manager directly
            user_manager = UserManager(user_db)
            
            # Create user data with the UserCreate model
            user_create = UserCreate(
                email="admin@example.com",
                password="admin123",
                is_active=True,
                is_superuser=True,
                is_verified=True,
                first_name="Admin",
                last_name="User",
            )
            
            # Create superuser
            await user_manager.create(user_create)
            logger.info("Superuser created")
    except UserAlreadyExists:
        logger.info("Superuser already exists")
    except Exception as e:
        logger.error(f"Error creating superuser: {e}")


async def main():
    """Main function to initialize database."""
    # Debug database before creating tables
    logger.info("Debugging database")
    await debug_database()
    
    # Create all tables
    logger.info("Creating database tables")
    await create_tables()
    
    # Create superuser
    logger.info("Creating superuser")
    await create_superuser()
    
    # Debug database after creating tables
    logger.info("Debugging database after table creation")
    await debug_database()
    
    logger.info("Initial data created")


if __name__ == "__main__":
    asyncio.run(main()) 