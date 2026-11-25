import asyncio

from pydantic import EmailStr, Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import async_session_maker, engine
from src.core.security import hash_password
from src.models import PromoCode, User, UserRole


class SeedSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="SEED_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        hide_input_in_errors=True,
    )

    admin_email: EmailStr = "admin@example.com"
    admin_password: SecretStr = Field(min_length=12)
    customer_email: EmailStr = "customer@example.com"
    customer_password: SecretStr = Field(min_length=12)


async def ensure_user(
    session: AsyncSession, email: str, password_hash: str, role: UserRole
) -> None:
    statement = (
        insert(User)
        .values(email=email, password_hash=password_hash, role=role)
        .on_conflict_do_nothing(index_elements=[User.email])
        .returning(User.id)
    )
    inserted_id = await session.scalar(statement)
    if inserted_id is None:
        existing_role = await session.scalar(
            select(User.role).where(User.email == email)
        )
        if existing_role != role:
            raise ValueError(
                f"Seed email {email} is already associated with another role"
            )


async def main() -> None:
    try:
        settings = SeedSettings()
        admin_email = settings.admin_email.lower()
        customer_email = settings.customer_email.lower()
        if admin_email == customer_email:
            raise ValueError(
                "The administrator and customer must have different emails"
            )

        admin_hash = hash_password(settings.admin_password.get_secret_value())
        customer_hash = hash_password(settings.customer_password.get_secret_value())

        async with async_session_maker.begin() as session:
            await ensure_user(session, admin_email, admin_hash, UserRole.ADMIN)
            await ensure_user(session, customer_email, customer_hash, UserRole.CUSTOMER)
            await session.execute(
                insert(PromoCode)
                .values(code="SAVE10", discount_percentage=10, is_active=True)
                .on_conflict_do_nothing(index_elements=[PromoCode.code])
            )
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
