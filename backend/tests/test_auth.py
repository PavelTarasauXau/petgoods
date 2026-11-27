from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

UNAVAILABLE_DATABASE_URL = "postgresql+asyncpg://unused:unused@127.0.0.1:1/unused"
CUSTOMER = {"email": "auth-customer@example.com", "password": "test-customer-password"}


@pytest.fixture
def auth_client(database_app: FastAPI) -> Iterator[TestClient]:
    from src.api.auth import require_admin
    from src.models import User

    @database_app.get("/test/admin")
    async def admin_access(user: Annotated[User, Depends(require_admin)]):
        return {"role": user.role}

    with TestClient(database_app) as client:
        yield client


def login(client: TestClient, credentials: dict[str, str]) -> dict:
    response = client.post("/api/auth/login", json=credentials)
    assert response.status_code == 200, response.json()
    return response.json()


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_register_login_and_read_profile(auth_client: TestClient, jwt_secret: str):
    registration = auth_client.post("/api/auth/register", json=CUSTOMER)
    assert registration.status_code == 201
    profile = registration.json()
    assert set(profile) == {"id", "email", "role", "created_at"}
    assert profile["role"] == "customer"

    uppercase_email = {**CUSTOMER, "email": CUSTOMER["email"].upper()}
    assert (
        auth_client.post("/api/auth/register", json=uppercase_email).status_code == 409
    )

    token = login(auth_client, uppercase_email)
    assert token["token_type"] == "bearer"
    claims = jwt.decode(token["access_token"], jwt_secret, algorithms=["HS256"])
    assert claims["sub"] == str(profile["id"])
    assert claims["role"] == "customer"
    assert claims["exp"] > claims["iat"]

    response = auth_client.get("/api/auth/me", headers=bearer(token["access_token"]))
    assert response.status_code == 200
    assert response.json() == profile


@pytest.mark.parametrize(
    "invalid_field",
    [{"email": "not-an-email"}, {"password": "short"}, {"role": "admin"}],
)
def test_registration_rejects_invalid_input(auth_client: TestClient, invalid_field):
    payload = {**CUSTOMER, **invalid_field}
    response = auth_client.post("/api/auth/register", json=payload)
    assert response.status_code == 422
    assert all("input" not in error for error in response.json()["detail"])


def test_login_rejects_wrong_password_and_unknown_email(
    auth_client: TestClient, admin_credentials
):
    wrong_password = auth_client.post(
        "/api/auth/login", json={**admin_credentials, "password": "wrong"}
    )
    unknown_email = auth_client.post(
        "/api/auth/login", json={**admin_credentials, "email": "unknown@example.com"}
    )
    assert wrong_password.status_code == unknown_email.status_code == 401
    assert wrong_password.json() == unknown_email.json()
    assert wrong_password.headers["WWW-Authenticate"] == "Bearer"


def test_login_returns_503_when_postgres_is_unavailable(
    monkeypatch: pytest.MonkeyPatch,
    jwt_secret: str,
):
    monkeypatch.setenv("DATABASE_URL", UNAVAILABLE_DATABASE_URL)

    from src.core.config import settings
    from src.core.database import get_async_session
    from src.main import app

    monkeypatch.setattr(settings, "JWT_SECRET", SecretStr(jwt_secret))
    unavailable_engine = create_async_engine(UNAVAILABLE_DATABASE_URL)
    unavailable_sessions = async_sessionmaker(unavailable_engine)

    async def unavailable_session():
        try:
            async with unavailable_sessions() as session:
                yield session
        finally:
            await unavailable_engine.dispose()

    monkeypatch.setitem(
        app.dependency_overrides, get_async_session, unavailable_session
    )
    with TestClient(app) as client:
        response = client.post("/api/auth/login", json=CUSTOMER)
        assert response.status_code == 503
        assert response.json() == {"detail": "database unavailable"}
        assert client.get("/api/health").status_code == 200

        responses = client.get("/openapi.json").json()["paths"]["/api/auth/login"][
            "post"
        ]["responses"]
        assert {"401", "503"} <= responses.keys()


def test_profile_rejects_missing_invalid_or_expired_token(
    auth_client: TestClient, admin_credentials, jwt_secret: str
):
    token = login(auth_client, admin_credentials)["access_token"]
    claims = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    expired = jwt.encode(
        {**claims, "exp": datetime.now(UTC) - timedelta(minutes=1)},
        jwt_secret,
        algorithm="HS256",
    )
    missing_exp = jwt.encode(
        {key: value for key, value in claims.items() if key != "exp"},
        jwt_secret,
        algorithm="HS256",
    )
    wrong_signature = jwt.encode(
        claims, "another-test-key-not-used-by-the-server", algorithm="HS256"
    )
    for headers in (
        {},
        bearer("invalid"),
        bearer(expired),
        bearer(missing_exp),
        bearer(wrong_signature),
    ):
        response = auth_client.get("/api/auth/me", headers=headers)
        assert response.status_code == 401
        assert response.headers["WWW-Authenticate"] == "Bearer"


def test_admin_guard_accepts_only_admin(auth_client: TestClient, admin_credentials):
    assert auth_client.post("/api/auth/register", json=CUSTOMER).status_code == 201
    admin = bearer(login(auth_client, admin_credentials)["access_token"])
    customer = bearer(login(auth_client, CUSTOMER)["access_token"])

    assert auth_client.get("/api/auth/me", headers=admin).json()["role"] == "admin"
    assert auth_client.get("/test/admin", headers=admin).status_code == 200
    assert auth_client.get("/test/admin", headers=customer).status_code == 403
    assert auth_client.get("/test/admin").status_code == 401


def test_openapi_documents_bearer_scheme(auth_client: TestClient):
    document = auth_client.get("/openapi.json").json()
    assert document["components"]["securitySchemes"]["HTTPBearer"]["scheme"] == "bearer"
    assert document["paths"]["/api/auth/me"]["get"]["security"] == [{"HTTPBearer": []}]
