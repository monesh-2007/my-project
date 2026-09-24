import time
from contextlib import asynccontextmanager
from typing import List, Optional

from dotenv import load_dotenv # Add this line
import os                      # Add this line

load_dotenv()                  # Add this line BEFORE FastAPI starts

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from database import engine
import models
from routes import ai_assistant, patients, vitals
from services.llm_service import generate_medical_response


@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MediCare AI",
    description="Personal health assistant API for tracking vitals, medications, "
    "symptoms, and chatting with an AI health assistant.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_assistant.router)
app.include_router(patients.router)
app.include_router(vitals.router)


class AnalyzeRequest(BaseModel):
    symptoms: List[str] = Field(default_factory=list)
    description: Optional[str] = ""


class ChatRequest(BaseModel):
    message: str = ""


def _error_payload(message: str, extra: Optional[dict] = None) -> JSONResponse:
    body = {"status": "error", "error": message}
    if extra:
        body.update(extra)
    return JSONResponse(status_code=200, content=body)


@app.get("/")
def root():
    return {"status": "ok", "service": "MediCare AI API"}


@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": time.time()}


@app.post("/api/analyze")
async def analyze_symptoms(payload: AnalyzeRequest):
    """Generate a brief Gemini-backed analysis of the submitted symptoms."""
    try:
        selected = [s.strip() for s in payload.symptoms if s and s.strip()]
        notes = (payload.description or "").strip()

        if not selected and not notes:
            return _error_payload(
                "Please provide at least one symptom.",
                {"analysis": None},
            )

        symptom_list = ", ".join(selected) if selected else "none selected"
        prompt = (
            "Provide a brief medical analysis (about 2–4 short paragraphs) of the "
            "following symptoms. Cover possible common, non-emergency explanations "
            "and general self-care guidance. Do not diagnose. If anything sounds "
            "urgent, say to seek emergency care.\n\n"
            f"Selected symptoms: {symptom_list}\n"
            f"Additional description: {notes or 'none provided'}"
        )

        analysis = await generate_medical_response(prompt)
        return {"status": "ok", "analysis": analysis, "error": None}
    except Exception as exc:
        return _error_payload(
            f"Could not complete analysis: {exc}",
            {"analysis": None},
        )


@app.post("/api/assistant/chat")
async def assistant_chat(payload: ChatRequest):
    """Chat with the Gemini-backed health assistant."""
    try:
        message = (payload.message or "").strip()
        if not message:
            return _error_payload(
                "Please enter a message.",
                {"response": None},
            )

        response = await generate_medical_response(message)
        return {"status": "ok", "response": response, "error": None}
    except Exception as exc:
        return _error_payload(
            f"Could not reach the assistant: {exc}",
            {"response": None},
        )
