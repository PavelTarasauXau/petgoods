from collections.abc import Awaitable, Callable
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from src.api.database_route import DatabaseRoute
from src.core.config import settings
from src.core.database import Session
from src.core.security import hash_password, verify_password
from src.models import User, UserRole
from src.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


class AuthRoute(DatabaseRoute):
    def get_route_handler(self) -> Callable[[Request], Awaitable[Response]]:
        route = super().get_route_handler()

        async def handle(request: Request) -> Response:
            try:
                return await route(request)
            except RequestValidationError as exc:
                errors = [
                    {key: error[key] for key in ("type", "loc", "msg")}
                    for error in exc.errors()
                ]
                return JSONResponse(status_code=422, content={"detail": errors})

        return handle


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    route_class=AuthRoute,
    responses={503: {"description": "Authentication service unavailable"}},
)
bearer_scheme = HTTPBearer(bearerFormat="JWT", auto_error=False)
BearerCredentials = Annotated[
    HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
]
JWT_ALGORITHM = "HS256"
_UNKNOWN_PASSWORD_HASH = hash_password("unused-credential-for-login-timing")


def unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def jwt_secret() -> str:
    if settings.JWT_SECRET is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is not configured",
        )
    return settings.JWT_SECRET.get_secret_value()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(credentials: RegisterRequest, session: Session) -> UserResponse:
    password_hash = await run_in_threadpool(
        hash_password, credentials.password.get_secret_value()
    )
    statement = (
        insert(User)
        .values(
            email=credentials.email,
            password_hash=password_hash,
            role=UserRole.CUSTOMER,
        )
        .on_conflict_do_nothing(index_elements=[User.email])
        .returning(User)
    )
    user = await session.scalar(statement)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )
    await session.commit()
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    responses={401: {"description": "Incorrect email or password"}},
)
async def login(credentials: LoginRequest, session: Session) -> TokenResponse:
    secret = jwt_secret()
    user = await session.scalar(select(User).where(User.email == credentials.email))
    password_hash = user.password_hash if user else _UNKNOWN_PASSWORD_HASH
    password_valid = await run_in_threadpool(
        verify_password, credentials.password.get_secret_value(), password_hash
    )
    if user is None or not password_valid:
        raise unauthorized("Incorrect email or password")

    now = datetime.now(UTC)
    token = jwt.encode(
        {
            "sub": str(user.id),
            "role": user.role.value,
            "iat": now,
            "exp": now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_MINUTES),
        },
        secret,
        algorithm=JWT_ALGORITHM,
    )
    return TokenResponse(access_token=token)


async def get_current_user(credentials: BearerCredentials, session: Session) -> User:
    if credentials is None:
        raise unauthorized("Authentication required")
    secret = jwt_secret()
    try:
        claims = jwt.decode(
            credentials.credentials,
            secret,
            algorithms=[JWT_ALGORITHM],
            options={"require": ["sub", "role", "exp"]},
        )
        user_id = int(claims["sub"])
    except (jwt.InvalidTokenError, ValueError) as exc:
        raise unauthorized("Invalid or expired access token") from exc

    if not 1 <= user_id <= 2_147_483_647:
        raise unauthorized("Invalid access token subject")
    user = await session.get(User, user_id)
    if user is None:
        raise unauthorized("User no longer exists")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def require_admin(user: CurrentUser) -> User:
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Administrator role required"
        )
    return user


@router.get("/me")
async def me(user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(user)
