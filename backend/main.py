from fastapi import FastAPI
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User
from schemas.user import UserCreate, UserLogin
from utils.hash import hash_password, verify_password
from utils.auth import create_access_token
from models.company import Company
from schemas.company import CompanyCreate
from schemas.question import QuestionCreate
from models.question import Question

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Welcome to CareerOS Backend 🚀"
    }

@app.post("/register")
def register(user: UserCreate):

    db: Session = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {
            "message": "Email already registered"
        }

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.id
    }


@app.post("/login")
def login(user: UserLogin):

    db: Session = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        return {
            "message": "User not found"
        }

    if not verify_password(
        user.password,
        existing_user.password
    ):
        return {
            "message": "Invalid password"
        }

    access_token = create_access_token(
        {
            "user_id": existing_user.id,
            "email": existing_user.email
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "name": existing_user.name
    }

@app.post("/companies")
def add_company(company: CompanyCreate):

    db: Session = SessionLocal()

    new_company = Company(
        company_name=company.company_name,
        role=company.role,
        experience=company.experience,
        package=company.package,
        roadmap=company.roadmap
    )

    db.add(new_company)

    db.commit()

    db.refresh(new_company)

    return {
        "message": "Company Added Successfully",
        "company_id": new_company.id
    }

@app.get("/companies")
def get_companies():

    db: Session = SessionLocal()

    companies = db.query(Company).all()

    return companies

@app.post("/questions")
def add_question(question: QuestionCreate):

    db: Session = SessionLocal()

    new_question = Question(
        company_id=question.company_id,
        question=question.question,
        answer=question.answer,
        difficulty=question.difficulty
    )

    db.add(new_question)

    db.commit()

    db.refresh(new_question)

    return {
        "message": "Question Added Successfully",
        "question_id": new_question.id
    }
@app.get("/questions")
def get_questions():

    db: Session = SessionLocal()

    questions = db.query(Question).all()

    return questions

