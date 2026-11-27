import logging
from collections.abc import Awaitable, Callable

from asyncpg import (
    CannotConnectNowError,
    PostgresConnectionError,
    TooManyConnectionsError,
)
from fastapi import HTTPException, Request, Response, status
from fastapi.routing import APIRoute
from sqlalchemy.exc import DBAPIError
from sqlalchemy.exc import TimeoutError as PoolTimeoutError

logger = logging.getLogger(__name__)


class DatabaseRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Awaitable[Response]]:
        route = super().get_route_handler()

        async def handle(request: Request) -> Response:
            try:
                return await route(request)
            except (
                OSError,
                DBAPIError,
                PoolTimeoutError,
                PostgresConnectionError,
                CannotConnectNowError,
                TooManyConnectionsError,
            ) as exc:
                if isinstance(exc, DBAPIError) and not exc.connection_invalidated:
                    raise
                logger.warning("PostgreSQL unavailable: %s", type(exc).__name__)
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="database unavailable",
                ) from exc

        return handle
