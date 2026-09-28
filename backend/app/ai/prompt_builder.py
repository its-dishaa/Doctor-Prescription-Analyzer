from pathlib import Path


class PromptBuilder:

    PROMPT_FILE = (
        Path(__file__).parent
        / "prompts"
        / "investigation_prompt.txt"
    )

    @classmethod
    def investigation_prompt(cls) -> str:
        return cls.PROMPT_FILE.read_text(
            encoding="utf-8"
        )