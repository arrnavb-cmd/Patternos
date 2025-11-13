
# Run this to create the new tables
from app.database import engine
from app.intelligence.behavioral.models import Base

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Created behavioral intelligence tables")
