# PawsStore

Интернет-магазин товаров для животных.

## Структура

```
frontend/   клиентское приложение (React + Vite), см. frontend/README.md
backend/    серверная часть и REST API (FastAPI + PostgreSQL)
```

## Запуск через Docker Compose

Включите Docker Desktop. При первом запуске скопируйте корневой
`.env.example` в `.env`. Для входа через JWT задайте `JWT_SECRET` в
`backend/.env` по инструкции ниже.

```powershell
Copy-Item .env.example .env
docker compose up --build -d --wait
```

Сервис `app` ждёт готовности PostgreSQL и Redis, применяет миграции
Alembic и запускает FastAPI. Swagger открывается на
[`127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs).
Для другого порта задайте `APP_PORT` в корневом `.env`.
PostgreSQL доступен с хоста на `127.0.0.1:5433`, Redis — на
`127.0.0.1:6379`. PostgreSQL сохраняет данные в томе `postgres_data`.

Compose передаёт в `app` настройки из `backend/.env` и задаёт подключение к
контейнерной PostgreSQL по адресу `postgres:5432`. После изменения
`backend/.env` пересоздайте `app` командой
`docker compose up -d --force-recreate --wait app`.

## Запуск FastAPI на хосте

Для разработки с автоматической перезагрузкой оставьте PostgreSQL и Redis
в Compose, затем запустите FastAPI из папки `backend`.

```powershell
docker compose stop app
docker compose up -d --wait postgres redis
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

Из корня проекта запустите seed в контейнере. Если вы добавили пароли после
запуска Compose, сначала пересоздайте сервис `app`.

```powershell
docker compose exec app python -m src.seed
```

При запуске FastAPI на хосте выполните `uv run python -m src.seed` из папки
`backend` в терминале с заданным `DATABASE_URL`.

Команда добавляет администратора `admin@example.com`, покупателя
`customer@example.com` и промокод `SAVE10` со скидкой 10%.
Повторный запуск сохраняет существующие пароли, роли и параметры промокода.

## Регистрация и вход

В `backend/.env` задайте `JWT_SECRET`. Сгенерируйте уникальное значение
командой `uv run python -c "import secrets; print(secrets.token_urlsafe(32))"`.
Параметр `JWT_ACCESS_TOKEN_MINUTES` задаёт срок действия токена в минутах,
по умолчанию 30.

В [Swagger](http://127.0.0.1:8000/docs) отправьте email и пароль через
`POST /api/auth/register`, чтобы создать покупателя. В
`POST /api/auth/login` можно использовать новый аккаунт или локальные
учётные записи из seed. Скопируйте `access_token`, нажмите **Authorize**
и вставьте токен в поле **Value**. Запрос `GET /api/auth/me` покажет
ID, email и роль текущего пользователя.

Для интеграционных тестов укажите `TEST_DATABASE_URL` с адресом
отдельной PostgreSQL, на которую применены миграции. Из папки `backend`
выполните `uv run python -m pytest`. Тестовые транзакции откатываются в конце
каждого сценария.

## Каталог

`GET /api/products` возвращает `items` и `meta` с номером страницы,
размером страницы и общим количеством товаров и страниц. По умолчанию
выдаётся первая страница из 12 товаров с сортировкой по названию.
Можно передать `search`, `min_price`, `max_price`, `min_rating`,
`sort_by` (`price` или `title`) и `order` (`asc` или `desc`).

В Swagger войдите под администратором и через `POST /api/products`
создайте товар с названием, описанием, ценой и хотя бы тремя URL изображений.
Товар появится в публичном каталоге и будет доступен по
`GET /api/products/{product_id}`. `PATCH` меняет указанные поля, а
`DELETE` скрывает товар из каталога и возвращает `204`.

### Начальное наполнение каталога

Готовые тела для `POST /api/products` лежат в
[`backend/seed_data/products`](backend/seed_data/products/).
В Swagger войдите под администратором и отправьте содержимое каждого JSON
отдельным запросом. Цены, названия и описания взяты из `products.js`.
Прежние ID, связи, характеристики и дополнительные сведения сохранены в
`specs`. Остаток можно указать через `stock_quantity`, по умолчанию он равен нулю.

Для локального запуска JPG находятся в `backend/media/products` и доступны по
`http://127.0.0.1:8000/media/products/<товар>/<кадр>.jpg`.
При нестандартном `APP_PORT` поправьте порт в JSON. При деплое загрузите
изображения в публичный бакет Supabase Storage и поставьте публичные ссылки
из него в поле `images`.
