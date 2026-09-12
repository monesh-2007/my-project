from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import engine
import models
from routes import ai_assistant, patients, vitals
from services.llm_service import generate_medical_response

# The lifespan context manager replaces the deprecated @app.on_event("startup")
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code before yield executes before the application starts receiving requests
    models.Base.metadata.create_all(bind=engine)
    yield
    # Code after yield would execute during shutdown

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


class AnalyzeResponse(BaseModel):
    analysis: str


@app.get("/")
def root():
    return {"status": "ok", "service": "MediCare AI API"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_symptoms(payload: AnalyzeRequest):
    """Generate a brief Gemini-backed analysis of the submitted symptoms."""
    selected = [s.strip() for s in payload.symptoms if s and s.strip()]
    notes = (payload.description or "").strip()

    if not selected and not notes:
        raise HTTPException(status_code=400, detail="Please provide at least one symptom.")

    symptom_list = ", ".join(selected) if selected else "none selected"
    prompt = (
        "Provide a brief medical analysis (about 2–4 short paragraphs) of the "
        "following symptoms. Cover possible common, non-emergency explanations "
        "and general self-care guidance. Do not diagnose. If anything sounds "
        "urgent, say to seek emergency care.\n\n"
        f"Selected symptoms: {symptom_list}\n"
        f"Additional description: {notes or 'none provided'}"
    )

    try:
        analysis = await generate_medical_response(prompt)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return AnalyzeResponse(analysis=analysis)
