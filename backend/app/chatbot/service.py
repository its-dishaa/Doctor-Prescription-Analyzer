
import os

import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = "https://ollama.com/api/chat"
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma4")

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
    if not OLLAMA_API_KEY:
        raise RuntimeError("OLLAMA_API_KEY is not configured.")

    recent_conversation = conversation[-6:]

    investigation_context = ""
    if investigations:
        formatted = [
            format_investigation(item)
            for item in investigations
        ]
        investigation_context = (
            "\n\nCurrent prescription investigations:\n"
            + "\n".join(f"- {item}" for item in formatted)
        )

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT + investigation_context
        }
    ]

    for item in recent_conversation:
        messages.append({
            "role": item["role"],
            "content": item["content"]
        })

    messages.append({
        "role": "user",
        "content": message
    })

    try:
        response = requests.post(
            OLLAMA_URL,
            headers={
                "Authorization": f"Bearer {OLLAMA_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 150,
                },
            },
            timeout=(10, 60),
        )
        response.raise_for_status()
        data = response.json()

        reply = data.get("message", {}).get("content")
        if not reply:
            raise RuntimeError("Ollama returned an empty response.")

        return reply.strip()

    except requests.Timeout as exc:
        raise RuntimeError(
            "Ollama Cloud took too long to respond. Please try again."
        ) from exc
    except requests.RequestException as exc:
        raise RuntimeError(
            f"Ollama Cloud request failed: {exc}"
        ) from exc
