# Art of Workflows API

A FastAPI backend for the Art of Workflows application.

## Features

- FastAPI for high-performance API
- JWT Authentication with fastapi-users
- PostgreSQL database with SQLAlchemy ORM
- Lead submission API
- User management

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL database (Retool DB)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname
SECRET_KEY=your-very-secret-key
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### Installation

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate the virtual environment:

```bash
# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Initialize the database:

```bash
python -m app.initial_data
```

5. Run the application:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000.

## API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker

To run the application using Docker:

```bash
docker build -t art-of-workflows-api .
docker run -p 8000:8000 --env-file .env art-of-workflows-api
``` 