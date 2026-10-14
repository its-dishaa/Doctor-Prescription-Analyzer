
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

    MAX_RETRIES = 3

    # Retry temporary server/network errors, not exhausted quotas.
    RETRYABLE_STATUS_CODES = {408, 500, 502, 503, 504}

    def __init__(self):
        self.client = GeminiClient.get_client()

    def analyze_image(self, image_path: str) -> GeminiResponse:
        total_start = time.perf_counter()
        image_path = Path(image_path)

        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        prompt = PromptBuilder.investigation_prompt()
        uploaded_file = None

        try:
            # Measure image upload time.
            upload_start = time.perf_counter()
            uploaded_file = self.client.files.upload(
                file=str(image_path)
            )
            print(
                f"[TIMING] Gemini file upload: "
                f"{time.perf_counter() - upload_start:.2f}s"
            )

            response = None

            for attempt in range(self.MAX_RETRIES):
                try:
                    print(
                        f"Gemini attempt {attempt + 1}/"
                        f"{self.MAX_RETRIES}"
                    )

                    generation_start = time.perf_counter()

                    response = self.client.models.generate_content(
                        model=settings.GEMINI_MODEL,
                        contents=[uploaded_file, prompt],
                    )

                    print(
                        f"[TIMING] Gemini generation: "
                        f"{time.perf_counter() - generation_start:.2f}s"
                    )
                    break

                except errors.APIError as exc:
                    status_code = getattr(exc, "code", None)
                    print(f"Gemini API error ({status_code}): {exc}")

                    # A quota error needs quota recovery, not retries.
                    if status_code == 429:
                        raise RuntimeError(
                            "Gemini API quota exceeded. Check your "
                            "quota and billing, or wait for the reset."
                        ) from exc

                    if status_code not in self.RETRYABLE_STATUS_CODES:
                        raise

                    if attempt == self.MAX_RETRIES - 1:
                        raise RuntimeError(
                            "Gemini is temporarily unavailable. "
                            "Please try again shortly."
                        ) from exc

                    delay = min(2 ** (attempt + 1), 8)
                    delay += random.uniform(0, 0.5)

                    print(
                        f"Retrying Gemini in {delay:.1f} seconds."
                    )
                    time.sleep(delay)

            if response is None or not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            # Measure response parsing time.
            parse_start = time.perf_counter()
            result = ResponseParser.parse(response.text)

            print(
                f"[TIMING] Response parsing: "
                f"{time.perf_counter() - parse_start:.2f}s"
            )
            return result

        finally:
            if uploaded_file is not None:
                try:
                    cleanup_start = time.perf_counter()
                    self.client.files.delete(
                        name=uploaded_file.name
                    )
                    print(
                        f"[TIMING] Gemini file cleanup: "
                        f"{time.perf_counter() - cleanup_start:.2f}s"
                    )
                except Exception as cleanup_error:
                    print(
                        "Warning: Gemini file cleanup failed: "
                        f"{cleanup_error}"
                    )

            print(
                f"[TIMING] Total Gemini service time: "
                f"{time.perf_counter() - total_start:.2f}s"
            )
