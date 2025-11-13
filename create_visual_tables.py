from app.database import engine
from app.intelligence.visual.models import Base

# Create visual intelligence tables
Base.metadata.create_all(bind=engine)
print("✅ Created visual intelligence tables")
