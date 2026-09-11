from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import ai_assistant, patients, vitals

app = FastAPI(
    title="MediCare AI",
    description="Personal health assistant API for tracking vitals, medications, "
    "symptoms, and chatting with an AI health assistant.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_assistant.router)
app.include_router(patients.router)
app.include_router(vitals.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"status": "ok", "service": "MediCare AI API"}