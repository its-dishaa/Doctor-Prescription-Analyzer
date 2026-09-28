
import json
import re

from app.ai.models import GeminiResponse


class ResponseParser:

    @staticmethod
    def parse(text: str) -> GeminiResponse:

        if text is None:
            raise ValueError(
                "Gemini returned None instead of a response."
            )

        text = str(text).strip()

        # --------------------------------------------------
        # Empty response
        # --------------------------------------------------
        if not text:
            raise ValueError(
                "Gemini returned an empty response."
            )

        print("\n========== TEXT SENT TO JSON PARSER ==========")
        print(repr(text))
        print("===============================================")

        # --------------------------------------------------
        # Remove Markdown code fences
        #
        # Handles:
        # ```json
        # {...}
        # ```
        #
        # and:
        # ```
        # {...}
        # ```
        # --------------------------------------------------
        text = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE
        )

        text = re.sub(
            r"\s*```$",
            "",
            text
        )

        text = text.strip()

        # --------------------------------------------------
        # First attempt: parse complete response
        # --------------------------------------------------
        try:
            data = json.loads(text)

        except json.JSONDecodeError:

            # --------------------------------------------------
            # Gemini may sometimes put text before/after JSON.
            # Try extracting the outer JSON object.
            # --------------------------------------------------
            start = text.find("{")
            end = text.rfind("}")

            if start == -1 or end == -1 or end <= start:
                raise ValueError(
                    "Gemini did not return valid JSON.\n"
                    f"Raw Gemini response:\n{text}"
                )

            json_text = text[start:end + 1]

            try:
                data = json.loads(json_text)

            except json.JSONDecodeError as exc:
                raise ValueError(
                    "Gemini returned malformed JSON.\n"
                    f"Raw Gemini response:\n{text}"
                ) from exc

        # --------------------------------------------------
        # Validate structure using Pydantic
        # --------------------------------------------------
        try:
            return GeminiResponse(**data)

        except Exception as exc:
            raise ValueError(
                "Gemini JSON does not match the expected schema.\n"
                f"Parsed data:\n{data}"
            ) from exc