import os

import google.generativeai as genai
import dotenv

dotenv.load_dotenv()

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
GENERATION_CONFIG = {
    "temperature": 0.2,
    "max_output_tokens": 500,
}

SYSTEM_INSTRUCTION = (
    "You are a helpful medical assistant embedded in a personal health app called "
    "MediCare AI. Answer health-related questions clearly and supportively, using "
    "plain, non-alarming language. You are not a licensed physician and must never "
    "provide a diagnosis, prescribe treatment, or tell a user to stop or start a "
    "medication. If a user describes symptoms that could indicate a medical "
    "emergency, advise them to seek immediate in-person or emergency medical care. "
    "Every response you give is for informational purposes only and is not a "
    "substitute for professional medical advice, diagnosis, or treatment."
)

DISCLAIMER = (
    "\n\n---\n"
    "*This response is for informational purposes only and is not a substitute "
    "for professional medical advice, diagnosis, or treatment. Always consult a "
    "qualified healthcare provider with any questions about a medical condition.*"
)

_model = None


def _get_model():
    """Configure Gemini on first use so /health can stay lightweight."""
    global _model
    if _model is not None:
        return _model

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to the server environment."
        )

    genai.configure(api_key=api_key)
    _model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=SYSTEM_INSTRUCTION,
    )
    return _model


def _is_quota_error(error: Exception) -> bool:
    message = str(error).lower()
    return "429" in message or "quota" in message or "rate limit" in message


def _fallback_response(prompt: str) -> str:
    """Keep the app useful when the provider's free daily quota is exhausted."""
    if "selected symptoms:" in prompt.lower():
        return (
            "The AI service has reached its daily limit, so here is a general "
            "self-care check-in instead. Rest, drink water, eat something light "
            "if you have not eaten, and monitor whether your symptoms improve. "
            "Avoid self-diagnosing from this result. Seek urgent medical care for "
            "trouble breathing, chest pain, fainting, confusion, sudden severe "
            "pain, or rapidly worsening symptoms."
            + DISCLAIMER
        )

    return (
        "The AI service has reached its daily limit. For now, rest, stay hydrated, "
        "and contact a qualified healthcare professional for personalized advice. "
        "Seek emergency care for severe or rapidly worsening symptoms."
        + DISCLAIMER
    )


async def generate_medical_response(prompt: str) -> str:
    """
    Send a user prompt to Gemini and return the assistant's text response,
    with a medical disclaimer appended.
    """
    try:
        result = await _get_model().generate_content_async(
            prompt,
            generation_config=GENERATION_CONFIG,
        )
        text = (result.text or "").strip()
    except Exception as exc:
        if _is_quota_error(exc):
            return _fallback_response(prompt)
        raise RuntimeError(f"Failed to generate a response from Gemini: {exc}") from exc

    if not text:
        text = (
            "I wasn't able to generate a response to that. Could you try "
            "rephrasing your question?"
        )

    return text + DISCLAIMER
