
from pathlib import Path
import random
import time

from google.genai import errors

from app.ai.gemini_client import GeminiClient
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.ai.models import GeminiResponse
from app.core.config import settings


class GeminiService:
    """Handles Gemini Vision prescription analysis."""

    MAX_RETRIES = 4

    # Temporary errors that may succeed on retry.
    RETRYABLE_STATUS_CODES = {408, 429, 500, 502, 503, 504}

    def __init__(self):
        self.client = GeminiClient.get_client()

    def analyze_image(self, image_path: str) -> GeminiResponse:
        image_path = Path(image_path)

        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        prompt = PromptBuilder.investigation_prompt()
        uploaded_file = None

        try:
            uploaded_file = self.client.files.upload(
                file=str(image_path)
            )

            response = None

            for attempt in range(self.MAX_RETRIES):
                try:
                    print(
                        f"Gemini attempt {attempt + 1}/"
                        f"{self.MAX_RETRIES}"
                    )

                    response = self.client.models.generate_content(
                        model=settings.GEMINI_MODEL,
                        contents=[uploaded_file, prompt],
                    )

                    break

                except errors.APIError as exc:
                    status_code = getattr(exc, "code", None)
                    print(f"FULL GEMINI ERROR: {exc!r}")

                    # Don't retry permanent errors such as invalid
                    # credentials or an unsupported model.
                    if status_code not in self.RETRYABLE_STATUS_CODES:
                        raise

                    if attempt == self.MAX_RETRIES - 1:
                        print(
                            "Gemini retries exhausted. "
                            f"Last status: {status_code}"
                        )
                        raise RuntimeError(
                            "Gemini is temporarily unavailable. "
                            "Please try again shortly."
                        ) from exc

                    # Exponential backoff with a little random jitter.
                    delay = min(2 ** (attempt + 1), 16)
                    delay += random.uniform(0, 0.5)

                    print(
                        f"Gemini returned {status_code}. "
                        f"Retrying in {delay:.1f} seconds."
                    )
                    time.sleep(delay)

            if response is None or not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response. "
                    "Please try again."
                )

            return ResponseParser.parse(response.text)

        finally:
            # Best-effort cleanup; cleanup failure shouldn't hide
            # the original analysis error.
            if uploaded_file is not None:
                try:
                    self.client.files.delete(
                        name=uploaded_file.name
                    )
                except Exception as cleanup_error:
                    print(
                        "Warning: could not delete temporary "
                        f"Gemini file: {cleanup_error}"
                    )
