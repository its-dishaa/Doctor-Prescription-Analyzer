from pathlib import Path
import time

from google.genai import errors

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

        # --------------------------------
        # Gemini request with retry
        # --------------------------------

        max_retries = 3

        for attempt in range(max_retries):

            try:

                print(
                    f"\n========== GEMINI ATTEMPT "
                    f"{attempt + 1}/{max_retries} =========="
                )

                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[
                        uploaded_file,
                        prompt
                    ]
                )

                # Gemini request succeeded
                break

            except errors.ServerError as e:

                print(
                    "\n========== GEMINI SERVER ERROR =========="
                )

                print(e)

                print(
                    f"Attempt {attempt + 1} "
                    f"of {max_retries}"
                )

                print(
                    "=========================================\n"
                )

                # If this was the final attempt
                if attempt == max_retries - 1:

                    raise RuntimeError(
                        "Gemini is temporarily unavailable. "
                        "Please try again in a few moments."
                    )

                # Exponential backoff
                wait_time = 2 ** attempt

                print(
                    f"Retrying Gemini in "
                    f"{wait_time} seconds..."
                )

                time.sleep(wait_time)

        # --------------------------------
        # Print Gemini response
        # --------------------------------

        print(
            "\n========== GEMINI RAW RESPONSE =========="
        )

        print(response.text)

        print(
            "=========================================="
        )

        # --------------------------------
        # Parse JSON response
        # --------------------------------

        return ResponseParser.parse(
            response.text
        )