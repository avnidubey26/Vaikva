from sqlalchemy import Column, Integer, ForeignKey

from database import Base


class SavedCompany(Base):
    __tablename__ = "saved_companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )