from database import engine, Base
from models.user import User

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")