from pydantic import BaseModel


class SaveCompany(BaseModel):
    user_id: int
    company_id: int