from pydantic import BaseModel


class QuestionCreate(BaseModel):
    company_id: int
    question: str
    answer: str
    difficulty: str