from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/vitals", tags=["Vitals"])


@router.post("/", response_model=schemas.VitalResponse)
def create_vital(vital: schemas.VitalCreate, db: Session = Depends(get_db)):
    """Log a new vital sign for a user."""
    patient = db.query(models.User).filter(models.User.id == vital.user_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    db_vital = models.Vital(**vital.model_dump())
    db.add(db_vital)
    db.commit()
    db.refresh(db_vital)
    return db_vital


@router.get("/user/{user_id}", response_model=List[schemas.VitalResponse])
def get_vitals_for_user(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List vital signs recorded for a specific user, most recent first."""
    patient = db.query(models.User).filter(models.User.id == user_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return (
        db.query(models.Vital)
        .filter(models.Vital.user_id == user_id)
        .order_by(models.Vital.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )