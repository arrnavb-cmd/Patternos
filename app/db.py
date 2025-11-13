# app/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Base must be created BEFORE importing models to avoid circular imports ---
Base = declarative_base()

# Default DB url (can be overridden by env)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./patternos.db")

# Engine selection for sqlite vs others
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Import models only after Base is defined so SQLAlchemy metadata attaches correctly.
# models_db must import Base from this module.
from . import models_db  

def init_db():
    """Create tables (idempotent). Call this at startup or from a script."""
    # Import Base from models_db to use the same Base that models were declared with
    from .models_db import Base as ModelsBase
    ModelsBase.metadata.create_all(bind=engine)
