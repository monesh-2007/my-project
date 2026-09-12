from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routes import ai_assistant, patients, vitals

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
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_assistant.router)
app.include_router(patients.router)
app.include_router(vitals.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "MediCare AI API"}