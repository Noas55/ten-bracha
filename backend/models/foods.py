from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Foods(Base):
    __tablename__ = "foods"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    food_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    tradition = Column(String, nullable=False)
    first_blessing = Column(String, nullable=False)
    last_blessing = Column(String, nullable=False)
    note = Column(String, nullable=True)
    requires_clarification = Column(Boolean, nullable=True, default=False, server_default='false')
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)