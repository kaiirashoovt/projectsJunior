from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.future import select
import os

# ---------------------- Инициализация приложения ----------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kokonaihub.onrender.com"],  # адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- Настройки и подключение к БД ----------------------
load_dotenv()  # загружаем переменные из .env

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не установлен в переменных окружения!")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY не установлен в переменных окружения!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Асинхронное подключение к БД
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# ---------------------- Модель пользователя ----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column("pass", String, nullable=False)

# ---------------------- Pydantic модели ----------------------
class UserOut(BaseModel):
    email: EmailStr

    class Config:
        from_attributes = True  # чтобы SQLAlchemy объекты конвертировались

class UserCreate(BaseModel):
    email: EmailStr
    password: str

# ---------------------- Утилиты ----------------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------------- Роуты ----------------------
@app.post("/api/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверка на существующего пользователя
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    # Создание нового пользователя
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()

    # Генерация токена
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"token": access_token}

@app.post("/api/login")
async def login(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Поиск пользователя
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    # Генерация токена
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"token": access_token}

@app.get("/api/users", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

# ---------------------- Инициализация таблиц (при первом запуске) ----------------------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
