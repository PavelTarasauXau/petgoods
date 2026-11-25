# PawsStore

Интернет-магазин товаров для животных.

## Структура

```
frontend/   клиентское приложение (React + Vite), см. frontend/README.md
backend/    серверная часть и REST API (FastAPI + PostgreSQL)
```

## Локальный запуск бэкенда

Включите Docker Desktop и запустите PostgreSQL и Redis из корня проекта.
Команду копирования выполните при первом запуске.

```powershell
Copy-Item .env.example .env
docker compose up -d --wait
```

PostgreSQL доступен на `127.0.0.1:5433`, Redis — на `127.0.0.1:6379`.
PostgreSQL сохраняет данные в томе `postgres_data`.

Установите зависимости бэкенда, примените миграции и запустите FastAPI.

```powershell
Set-Location backend
uv sync --locked
$env:DATABASE_URL = 'postgresql+asyncpg://pawsstore:pawsstore@127.0.0.1:5433/pawsstore'
uv run alembic upgrade head
uv run fastapi dev
```

Если вы меняли параметры PostgreSQL в корневом `.env`, подставьте их в
`DATABASE_URL`. Значение из команды действует в текущем терминале PowerShell.

Проверка API доступна на [`/api/health`](http://127.0.0.1:8000/api/health)
и [`/api/health/db`](http://127.0.0.1:8000/api/health/db).

## Начальные данные для разработки

После применения миграций добавьте в `backend/.env` пароли в
`SEED_ADMIN_PASSWORD` и `SEED_CUSTOMER_PASSWORD`. Для каждого пароля
нужно минимум 12 символов. При необходимости укажите свои адреса в
`SEED_ADMIN_EMAIL` и `SEED_CUSTOMER_EMAIL`.

Запустите из папки `backend` в том же терминале, где задан
`DATABASE_URL` контейнерной БД.

```powershell
uv run python -m src.seed
```

Команда добавляет администратора `admin@example.com`, покупателя
`customer@example.com` и промокод `SAVE10` со скидкой 10%.
Повторный запуск сохраняет существующие пароли, роли и параметры промокода.
