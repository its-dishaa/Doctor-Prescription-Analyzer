from pathlib import Path

from app.ai.gemini_client import GeminiClient
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.ai.models import GeminiResponse
from app.core.config import settings


class GeminiService:
    """
    Handles communication with Gemini Vision.
    """

    def __init__(self):
        self.client = GeminiClient.get_client()

    def analyze_image(
        self,
        image_path: str
    ) -> GeminiResponse:

        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        prompt = PromptBuilder.investigation_prompt()

        uploaded_file = self.client.files.upload(
            file=str(image_path)
        )

        response = self.client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[
                uploaded_file,
                prompt
            ]
        )
        print("\n========== GEMINI RAW RESPONSE ==========")
        print(response.text)

        return ResponseParser.parse(
            response.text
        )