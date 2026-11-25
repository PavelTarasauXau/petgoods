from fastapi.testclient import TestClient


def test_health_starts_without_a_database(monkeypatch):
    monkeypatch.setenv(
        "DATABASE_URL", "postgresql+asyncpg://unused:unused@127.0.0.1:1/unused"
    )
    from src.main import app

    with TestClient(app) as client:
        response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
