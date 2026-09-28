from pathlib import Path
import os

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")


class Settings:
    APP_NAME = "Doctor Prescription Analyzer"
    APP_VERSION = "2.0.0"

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "models/gemini-3.5-flash"
    )


settings = Settings()