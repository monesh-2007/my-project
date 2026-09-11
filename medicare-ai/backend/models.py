from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=True)
    sex = Column(String, nullable=True)
    height = Column(Float, nullable=True)  # in cm
    weight = Column(Float, nullable=True)  # in kg

    vitals = relationship("Vital", back_populates="user", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")
    symptom_logs = relationship("SymptomLog", back_populates="user", cascade="all, delete-orphan")


class Vital(Base):
    __tablename__ = "vitals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # e.g. "heart_rate", "blood_pressure", "glucose"
    value = Column(String, nullable=False)  # string to support composite values like "120/80"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="vitals")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)  # e.g. "500mg twice daily"

    user = relationship("User", back_populates="medications")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symptoms = Column(String, nullable=False)  # comma-separated or free text
    severity = Column(String, nullable=False)  # e.g. "low", "moderate", "high"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="symptom_logs")