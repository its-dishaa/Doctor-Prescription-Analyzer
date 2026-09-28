from app.database.database import engine
from app.database.database import Base

import app.database.models

Base.metadata.create_all(bind=engine)

print("Database Created")