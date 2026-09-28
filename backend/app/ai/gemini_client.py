from google import genai

from app.core.config import settings


class GeminiClient:
    """
    Creates and manages the Gemini client.
    """

    @staticmethod
    def get_client():
        return genai.Client(
            api_key=settings.GEMINI_API_KEY
        )