from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class UserBase(BaseModel):
    age: Optional[int] = None
    sex: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None


class UserCreate(UserBase):
    """Request schema for creating a User."""
    pass


class UserResponse(UserBase):
    """Response schema for a User."""
    model_config = ConfigDict(from_attributes=True)  # Pydantic v2 equivalent of orm_mode = True

    id: int


# ---------------------------------------------------------------------------
# Vital
# ---------------------------------------------------------------------------

class VitalBase(BaseModel):
    type: str
    value: str


class VitalCreate(VitalBase):
    """Request schema for creating a Vital."""
    user_id: int


class VitalResponse(VitalBase):
    """Response schema for a Vital."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    timestamp: datetime


# ---------------------------------------------------------------------------
# Medication
# ---------------------------------------------------------------------------

class MedicationBase(BaseModel):
    name: str
    dosage: str


class MedicationCreate(MedicationBase):
    """Request schema for creating a Medication."""
    user_id: int


class MedicationResponse(MedicationBase):
    """Response schema for a Medication."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int


# ---------------------------------------------------------------------------
# SymptomLog
# ---------------------------------------------------------------------------

class SymptomLogBase(BaseModel):
    symptoms: str
    severity: str


class SymptomLogCreate(SymptomLogBase):
    """Request schema for creating a SymptomLog."""
    user_id: int


class SymptomLogResponse(SymptomLogBase):
    """Response schema for a SymptomLog."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    timestamp: datetime


# ---------------------------------------------------------------------------
# AI Assistant Chat
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Request schema for the AI assistant chat endpoint."""
    message: str


class ChatResponse(BaseModel):
    """Response schema for the AI assistant chat endpoint."""
    response: str