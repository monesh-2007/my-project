from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=schemas.UserResponse)
def create_patient(patient: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new patient profile."""
    db_patient = models.User(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.get("/", response_model=List[schemas.UserResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List patient profiles."""
    return db.query(models.User).offset(skip).limit(limit).all()


@router.get("/{patient_id}", response_model=schemas.UserResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get a single patient profile by ID."""
    db_patient = db.query(models.User).filter(models.User.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient