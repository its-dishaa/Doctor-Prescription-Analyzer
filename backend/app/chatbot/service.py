import requests


OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

OLLAMA_MODEL = "qwen2.5:3b"


SYSTEM_PROMPT = """
You are Claris AI, a fast assistant inside a doctor prescription
investigation analyzer.

Answer questions clearly and concisely.

If prescription investigations are provided, use them when relevant.

Never invent investigations that are not provided.

For medical topics, provide general educational information.
Do not diagnose the user or present yourself as a doctor.

Keep answers short unless the user asks for details.
"""


def format_investigation(item):

    if isinstance(item, dict):

        raw = item.get("raw_name", "")
        standard = item.get("standard_name", "")
        confidence = item.get("confidence")

        parts = []

        if raw:
            parts.append(f"Raw: {raw}")

        if standard:
            parts.append(f"Standard: {standard}")

        if confidence is not None:
            parts.append(f"Confidence: {confidence}")

        return " | ".join(parts)

    return str(item)


def generate_response(
    message: str,
    conversation: list,
    investigations: list
) -> str:

    # Only keep the most recent messages.
    # This prevents the prompt from becoming larger
    # during a long conversation.

    recent_conversation = conversation[-6:]


    # Prescription context

    investigation_context = ""

    if investigations:

        formatted = [
            format_investigation(item)
            for item in investigations
        ]

        investigation_context = (
            "\n\nCurrent prescription investigations:\n"
            + "\n".join(
                f"- {item}"
                for item in formatted
            )
        )


    messages = [
        {
            "role": "system",
            "content": (
                SYSTEM_PROMPT
                + investigation_context
            )
        }
    ]


    # Add only recent conversation

    for item in recent_conversation:

        messages.append(
            {
                "role": item["role"],
                "content": item["content"]
            }
        )


    # Current question

    messages.append(
        {
            "role": "user",
            "content": message
        }
    )


    response = requests.post(
        OLLAMA_URL,

        json={
            "model": OLLAMA_MODEL,

            "messages": messages,

            "stream": False,

            "keep_alive": "10m",

            "options": {
                "temperature": 0.2,
                "num_predict": 150
            }
        },

        timeout=120
    )


    response.raise_for_status()

    data = response.json()

    return data["message"]["content"]