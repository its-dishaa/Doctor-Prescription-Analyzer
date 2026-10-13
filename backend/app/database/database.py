import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool


# Render persistent disk uses /mnt/data.
# Locally, store the database inside the backend folder.
if os.name == "nt":
    DATABASE_PATH = Path(__file__).resolve().parents[2] / "doctor_prescription.db"
else:
    DATABASE_PATH = Path("/mnt/data/doctor_prescription.db")

DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

print("Database File:", DATABASE_PATH)

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 30,
    },
    poolclass=NullPool,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()