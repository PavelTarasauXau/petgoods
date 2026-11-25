from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        hide_input_in_errors=True,
    )

    DATABASE_URL: str
    DB_ECHO: bool = False
    JWT_SECRET: SecretStr | None = Field(default=None, min_length=32)
    JWT_ACCESS_TOKEN_MINUTES: int = Field(default=30, gt=0)


settings = Settings()
