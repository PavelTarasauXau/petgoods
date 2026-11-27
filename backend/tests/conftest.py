import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import pytest
from fastapi import FastAPI
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine


@pytest.fixture
def admin_credentials() -> dict[str, str]:
    return {"email": "auth-admin@example.com", "password": "test-admin-password"}


@pytest.fixture
def jwt_secret() -> str:
    return "test-only-jwt-key-for-auth-integration-tests"


@pytest.fixture
def database_app(
    monkeypatch: pytest.MonkeyPatch,
    admin_credentials: dict[str, str],
    jwt_secret: str,
) -> FastAPI:
    database_url = os.getenv("TEST_DATABASE_URL") or os.getenv("AUTH_TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("Set TEST_DATABASE_URL to a migrated test PostgreSQL database")
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql+asyncpg://unused:unused@127.0.0.1:1/unused"
    )

    from src.api.auth import router as auth_router
    from src.api.products import router as products_router
    from src.core.config import settings
    from src.core.database import get_async_session
    from src.core.security import hash_password
    from src.models import User, UserRole

    monkeypatch.setattr(settings, "JWT_SECRET", SecretStr(jwt_secret))
    test_engine = create_async_engine(database_url)

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        try:
            async with test_engine.connect() as connection:
                transaction = await connection.begin()
                sessions = async_sessionmaker(
                    bind=connection,
                    expire_on_commit=False,
                    join_transaction_mode="create_savepoint",
                )
                async with sessions.begin() as session:
                    session.add(
                        User(
                            email=admin_credentials["email"],
                            password_hash=hash_password(admin_credentials["password"]),
                            role=UserRole.ADMIN,
                        )
                    )

                async def test_session():
                    async with sessions() as session:
                        yield session

                application.dependency_overrides[get_async_session] = test_session
                try:
                    yield
                finally:
                    await transaction.rollback()
        finally:
            await test_engine.dispose()

    application = FastAPI(lifespan=lifespan)
    application.include_router(auth_router)
    application.include_router(products_router)
    return application
