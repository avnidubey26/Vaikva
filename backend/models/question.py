from sqlalchemy import Column, Integer, String
from database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer)

    question = Column(String, nullable=False)

    answer = Column(String)

    difficulty = Column(String)