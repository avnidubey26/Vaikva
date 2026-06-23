from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
from models.roadmap import Roadmap
from schemas.roadmap import RoadmapCreate
from models.saved_company import SavedCompany
from schemas.saved_company import SaveCompany


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    "name": existing_user.name,
    "user_id": existing_user.id
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

@app.get("/companies/{company_id}/questions")
def get_company_questions(company_id: int):

    db: Session = SessionLocal()

    questions = (
        db.query(Question)
        .filter(Question.company_id == company_id)
        .all()
    )

    return questions

@app.post("/roadmaps")
def add_roadmap(roadmap: RoadmapCreate):

    db: Session = SessionLocal()

    new_roadmap = Roadmap(
        company_id=roadmap.company_id,
        title=roadmap.title,
        description=roadmap.description
    )

    db.add(new_roadmap)

    db.commit()

    db.refresh(new_roadmap)

    return {
        "message": "Roadmap Added Successfully",
        "roadmap_id": new_roadmap.id
    }
@app.get("/roadmaps")
def get_roadmaps():

    db: Session = SessionLocal()

    roadmaps = db.query(Roadmap).all()

    return roadmaps
@app.get("/companies/{company_id}/roadmaps")
def get_company_roadmaps(company_id: int):

    db: Session = SessionLocal()

    roadmaps = (
        db.query(Roadmap)
        .filter(Roadmap.company_id == company_id)
        .all()
    )

    return roadmaps

@app.get("/dashboard/{company_id}")
def get_dashboard(company_id: int):

    db: Session = SessionLocal()

    company = (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )

    questions = (
        db.query(Question)
        .filter(Question.company_id == company_id)
        .all()
    )

    roadmaps = (
        db.query(Roadmap)
        .filter(Roadmap.company_id == company_id)
        .all()
    )

    return {
        "company": company,
        "questions": questions,
        "roadmaps": roadmaps
    }

@app.get("/companies/search/{keyword}")
def search_companies(keyword: str):

    db: Session = SessionLocal()

    companies = (
        db.query(Company)
        .filter(Company.company_name.ilike(f"%{keyword}%"))
        .all()
    )

    return companies

@app.get("/dashboard-stats")
def dashboard_stats():

    db: Session = SessionLocal()

    companies_count = db.query(Company).count()
    questions_count = db.query(Question).count()
    roadmaps_count = db.query(Roadmap).count()

    return {
        "companies": companies_count,
        "questions": questions_count,
        "roadmaps": roadmaps_count
    }

@app.post("/save-company")
def save_company(data: SaveCompany):

    db: Session = SessionLocal()

    existing = (
        db.query(SavedCompany)
        .filter(
            SavedCompany.user_id == data.user_id,
            SavedCompany.company_id == data.company_id
        )
        .first()
    )

    if existing:
        return {
            "message": "Company already saved"
        }

    saved = SavedCompany(
        user_id=data.user_id,
        company_id=data.company_id
    )

    db.add(saved)

    db.commit()

    db.refresh(saved)

    return {
        "message": "Company saved successfully"
    }


@app.get("/saved-companies/{user_id}")
def get_saved_companies(user_id: int):

    db: Session = SessionLocal()

    saved = (
        db.query(SavedCompany)
        .filter(SavedCompany.user_id == user_id)
        .all()
    )

    return saved


@app.delete("/saved-company/{saved_id}")
def delete_saved_company(saved_id: int):

    db: Session = SessionLocal()

    saved = (
        db.query(SavedCompany)
        .filter(SavedCompany.id == saved_id)
        .first()
    )

    if not saved:
        return {
            "message": "Saved company not found"
        }

    db.delete(saved)

    db.commit()

    return {
        "message": "Saved company removed"
    }