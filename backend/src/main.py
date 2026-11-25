from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from asyncpg import InterfaceError, PostgresError
from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from src.core.database import Session, engine


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    try:
        yield
    finally:
        await engine.dispose()


app = FastAPI(title="PawsStore API", lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/health/db")
async def health_db(session: Session):
    try:
        await session.execute(text("SELECT 1"))
    except (SQLAlchemyError, PostgresError, InterfaceError, OSError) as exc:
        raise HTTPException(status_code=503, detail="database unavailable") from exc
    return {"status": "ok", "database": "up"}
