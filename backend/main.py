from fastapi import FastAPI, HTTPException, Depends, Request, Path
from groq import AsyncGroq  # ← ИЗМЕНЕНО: AsyncGroq вместо Groq
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError


import os

load_dotenv()


def get_cors_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS")
    if origins:
        return [origin.strip() for origin in origins.split(",") if origin.strip()]

    return [
        "https://kokonai-hub.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

# ---------------------- Инициализация приложения ----------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- Настройки и подключение к БД ----------------------
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не установлен в переменных окружения!")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY не установлен в переменных окружения!")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY не установлен в переменных окружения!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_async_engine(DATABASE_URL, echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# ← ИЗМЕНЕНО: инициализируем AsyncGroq один раз
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# ---------------------- Модель пользователя ----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="")
    fullname = Column(String, nullable=True)  # если хочешь, отдельное поле
    phone = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    avatarurl = Column(String, nullable=True)  # поле для аватара
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column("pass", String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ---------------------- Pydantic модели ----------------------
class UserOut(BaseModel):
    email: EmailStr
    fullname: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None



class VisitLog(Base):
    __tablename__ = "visit_logs"

    id = Column(Integer, primary_key=True, index=True)
    ip = Column(String, index=True)
    user_agent = Column(String)
    page_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class ChatRequest(BaseModel):
    message: str

def serialize_user(user: User) -> dict:
    return {
        "email": user.email,
        "fullname": user.fullname,
        "phone": user.phone,
        "bio": user.bio,
        "avatarUrl": user.avatarurl,
    }

# ---------------------- Утилиты ----------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------------- Роуты ----------------------
@app.get("/health")
async def health():
    return {"status": "ok"}




@app.post("/api/register")
async def register(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Проверка длины пароля для bcrypt
    if len(user.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Пароль должен быть не больше 72 символов"
        )

    # Проверяем существование пользователя
    result = await db.execute(
        select(User).where(User.email == user.email)
    )

    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Пользователь уже существует"
        )

    try:
        hashed_password = get_password_hash(user.password)

        new_user = User(
            email=user.email,
            password=hashed_password,
            name="",
            created_at=datetime.utcnow()
        )

        db.add(new_user)

        await db.commit()
        await db.refresh(new_user)

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Ошибка сохранения пользователя"
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "token": access_token,
        "user": {
            "email": new_user.email
        }
    }


from sqlalchemy.exc import SQLAlchemyError

@app.post("/api/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    try:
        password_ok = verify_password(user.password, db_user.password)
    except ValueError:
        # Пароль в БД не захэширован — хэшируем и пробуем снова
        db_user.password = get_password_hash(db_user.password)
        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Ошибка сохранения хэша пароля")
        password_ok = verify_password(user.password, db_user.password)

    if not password_ok:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"token": access_token}

@app.post("/api/logout")
async def logout(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Токен отсутствует")

    token = auth_header.split(" ")[1]
    # Здесь можно записать логи, кто вышел, но токен мы не блокируем
    return {"message": "Logged out"}


@app.get("/api/users", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [serialize_user(user) for user in users]

@app.get("/api/users/{user_email}", response_model=UserOut)
async def get_user_by_email(
    user_email: str = Path(..., description="Email пользователя"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == user_email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return serialize_user(user)

@app.put("/api/user_update/{user_email}", response_model=UserOut)
async def update_user_by_email(
    user_update: UserUpdate,
    user_email: str = Path(..., description="Email пользователя"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == user_email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Проверка уникальности email, если меняется
    if user_update.email and user_update.email != user.email:
        existing = await db.execute(select(User).where(User.email == user_update.email))
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Email уже используется другим пользователем")

    field_map = {
        "fullname": "fullname",
        "email": "email",
        "phone": "phone",
        "bio": "bio",
        "avatarUrl": "avatarurl",
    }

    data = user_update.model_dump(exclude_unset=True)
    data = {k: v for k, v in data.items() if v is not None and v != ""}

    for field, value in data.items():
        orm_field = field_map.get(field)
        if orm_field:
            setattr(user, orm_field, value)

    try:
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except Exception as e:
        print("Ошибка при сохранении:", e)
        raise HTTPException(status_code=500, detail="Ошибка обновления пользователя")

    return serialize_user(user)

# ---------------------- Создание таблиц при старте ----------------------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.post("/api/track")
async def track_visit(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.json()
    page_url = body.get("page_url", "/")

    ip = request.client.host
    user_agent = request.headers.get("user-agent")

    log = VisitLog(ip=ip, user_agent=user_agent, page_url=page_url)
    db.add(log)
    await db.commit()
    return {"status": "ok"}



@app.get("/api/set_password/{user_email}/{new_password}")
async def set_password(
    user_email: str = Path(..., description="Email пользователя"),
    new_password: str = Path(..., description="Новый пароль"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == user_email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if len(new_password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Пароль должен быть не больше 72 символов"
        )

    hashed_password = get_password_hash(new_password)
    user.password = hashed_password

    try:
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except Exception as e:
        print("Ошибка при сохранении:", e)
        raise HTTPException(status_code=500, detail="Ошибка обновления пароля")

    return {"status": "ok", "message": "Пароль успешно обновлен"}


# ← НОВОЕ: System prompt про портфолио Мухамедали
CHAT_SYSTEM_PROMPT = """You are an AI assistant representing Muhammadali Kairasov (Ali), a fullstack developer from Semey, Kazakhstan.

YOUR ROLE:
You help visitors understand Ali's experience, technical skills, and interests. Be friendly, informative, and encouraging.

ABOUT ALI:
- Professional Experience: 2.5+ years as a fullstack developer
- Location: Semey, Kazakhstan
- Education: Bachelor's degree in Computer Engineering (Shakarim University)
- Focus: Enterprise applications, backend systems, integrations

TECH STACK:
Backend: Lua, PostgreSQL, REST APIs, FastAPI, Node.js, Go
Frontend: Angular, TypeScript, React, PrimeNG, Tailwind CSS, Vite
Tools & Infrastructure: Docker, Git, EDS/Digital Signatures, PDF processing, Groq API

PORTFOLIO PROJECT:
1. Kokonai Hub - Personal dashboard & portfolio website (React + FastAPI)
   - Features: User profiles, task/calendar widgets, AI chat assistant
   - Tech: Vite frontend, async PostgreSQL backend, Groq API integration
   - Demonstrates: Full-stack development, real-time features, API integration

PROFESSIONAL EXPERIENCE:
- Enterprise business process automation
- Backend systems and database optimization
- API integrations and data synchronization
- Document processing and workflow management
- Real-time monitoring and reporting
- Security and access control implementation
- Working with PostgreSQL, optimizing queries, managing complex workflows

INTERESTS & EXPERTISE:
- Building scalable backend systems
- Database design and optimization (working minutes calculation, complex queries)
- API design and integration (REST, async operations)
- Document processing (PDF, digital signatures)
- AI integration with Groq API
- Full-stack development with modern frameworks

COMMUNICATION STYLE:
- Professional but friendly and approachable
- Direct and concise (max 300 tokens per response)
- Use Russian when appropriate, English for code/technical terms
- Provide concrete technical examples
- Be honest about limitations

INSTRUCTIONS:
1. Keep responses focused and valuable
2. Can discuss technical challenges, solution approaches, and architectural decisions
3. Show genuine interest in what visitor asks
4. Offer deeper explanations if interested
5. End with a helpful suggestion or follow-up question when appropriate"""

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """
    AI chat endpoint powered by Groq Llama.
    Provides information about Ali's projects, experience, and tech skills.
    """
    try:
        # ← ИЗМЕНЕНО: валидация входа
        if not req.message or len(req.message.strip()) == 0:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if len(req.message) > 2000:
            raise HTTPException(status_code=400, detail="Message too long (max 2000 characters)")
        
        # ← ИЗМЕНЕНО: используем await для AsyncGroq
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": CHAT_SYSTEM_PROMPT
                },
                {"role": "user", "content": req.message}
            ],
            max_tokens=500,
            temperature=0.7
        )

        return {"reply": response.choices[0].message.content}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process your message")


# ← НОВОЕ: Healthcheck для чата
@app.get("/api/health/chat")
async def chat_health():
    """Check if Groq API is accessible."""
    try:
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "hi"}],
            max_tokens=10
        )
        return {"status": "healthy", "model": "llama-3.3-70b-versatile"}
    except Exception as e:
        print(f"Groq health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}, 503