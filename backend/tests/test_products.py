from collections.abc import Iterator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

PRODUCTS_URL = "/api/products"
PRODUCT = {
    "title": "Zebra Ball",
    "description": "A durable toy",
    "price": "10.00",
    "rating": 4,
    "stock_quantity": 3,
    "images": [
        "https://example.com/front.jpg",
        "https://example.com/side.jpg",
        "https://example.com/detail.jpg",
    ],
}


@pytest.fixture
def catalog_client(database_app: FastAPI) -> Iterator[TestClient]:
    with TestClient(database_app) as client:
        yield client


def login(client: TestClient, credentials: dict[str, str]) -> dict[str, str]:
    response = client.post("/api/auth/login", json=credentials)
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture
def admin_token(catalog_client: TestClient, admin_credentials) -> dict[str, str]:
    return login(catalog_client, admin_credentials)


def create_product(client: TestClient, headers: dict[str, str], **changes) -> dict:
    response = client.post(PRODUCTS_URL, headers=headers, json={**PRODUCT, **changes})
    assert response.status_code == 201, response.json()
    return response.json()


def test_list_paginates_and_sorts_in_both_directions(catalog_client, admin_token):
    empty = catalog_client.get(PRODUCTS_URL).json()
    assert empty == {
        "items": [],
        "meta": {"total_items": 0, "total_pages": 0, "current_page": 1, "limit": 12},
    }

    zebra = create_product(catalog_client, admin_token)
    apple = create_product(catalog_client, admin_token, title="Apple Ball")
    bed = create_product(catalog_client, admin_token, title="Pet Bed", price="30.00")

    default = catalog_client.get(PRODUCTS_URL).json()
    assert [p["title"] for p in default["items"]] == [
        "Apple Ball",
        "Pet Bed",
        "Zebra Ball",
    ]
    response = catalog_client.get(
        PRODUCTS_URL, params={"sort_by": "title", "order": "desc"}
    )
    assert [p["id"] for p in response.json()["items"]] == [
        zebra["id"],
        bed["id"],
        apple["id"],
    ]

    response = catalog_client.get(PRODUCTS_URL, params={"sort_by": "price", "limit": 2})
    payload = response.json()
    assert [p["id"] for p in payload["items"]] == [zebra["id"], apple["id"]]
    assert payload["meta"] == {
        "total_items": 3,
        "total_pages": 2,
        "current_page": 1,
        "limit": 2,
    }

    response = catalog_client.get(
        PRODUCTS_URL,
        params={"sort_by": "price", "order": "desc", "page": 2, "limit": 1},
    )
    assert [p["id"] for p in response.json()["items"]] == [zebra["id"]]
    far_page = catalog_client.get(
        PRODUCTS_URL, params={"page": 2_147_483_647, "limit": 100}
    )
    assert far_page.status_code == 200
    assert far_page.json()["items"] == []
    assert far_page.json()["meta"]["total_items"] == 3


def test_search_price_rating_and_literal_wildcards(catalog_client, admin_token):
    create_product(catalog_client, admin_token)
    mat = create_product(
        catalog_client,
        admin_token,
        title="Cotton Mat",
        description="A cozy BOWL mat",
        price="14.25",
        rating=4.5,
    )
    create_product(
        catalog_client, admin_token, title="Bowl / size_50%", price="22.00", rating=5
    )
    create_product(
        catalog_client, admin_token, title="Budget Bowl", price="14.25", rating=3.5
    )

    response = catalog_client.get(
        PRODUCTS_URL,
        params={
            "search": "bowL",
            "min_price": "14.25",
            "max_price": "14.25",
            "min_rating": 4.5,
        },
    )
    assert response.status_code == 200
    assert [p["id"] for p in response.json()["items"]] == [mat["id"]]
    assert response.json()["meta"]["total_items"] == 1
    for term in ("%", "_", "/ size_50%"):
        response = catalog_client.get(PRODUCTS_URL, params={"search": term})
        assert [p["title"] for p in response.json()["items"]] == ["Bowl / size_50%"]


def test_update_and_soft_delete(catalog_client, admin_token):
    product = create_product(
        catalog_client, admin_token, category="Toys", specs={"size": "M"}
    )
    url = f"{PRODUCTS_URL}/{product['id']}"
    assert catalog_client.get(url).json() == product

    changes = {
        "title": "Updated Ball",
        "price": "12.50",
        "category": None,
        "specs": None,
    }
    updated = catalog_client.patch(url, headers=admin_token, json=changes)
    assert updated.status_code == 200
    profile = updated.json()
    assert profile["title"] == "Updated Ball"
    assert profile["price"] == 12.5
    assert profile["images"] == product["images"]
    assert profile["category"] is None and profile["specs"] is None
    new_images = [
        image.replace("example.com", "example.org") for image in PRODUCT["images"]
    ]
    updated = catalog_client.patch(
        url, headers=admin_token, json={"images": new_images}
    )
    assert updated.status_code == 200
    assert updated.json()["images"] == new_images

    deleted = catalog_client.delete(url, headers=admin_token)
    assert deleted.status_code == 204 and deleted.content == b""
    assert catalog_client.get(url).status_code == 404
    assert (
        catalog_client.patch(
            url, headers=admin_token, json={"price": "11.00"}
        ).status_code
        == 404
    )
    assert catalog_client.delete(url, headers=admin_token).status_code == 404
    page = catalog_client.get(PRODUCTS_URL).json()
    assert page["items"] == []
    assert page["meta"]["total_items"] == 0


def test_catalog_writes_require_admin(catalog_client, admin_token):
    product = create_product(catalog_client, admin_token)
    url = f"{PRODUCTS_URL}/{product['id']}"
    credentials = {
        "email": "catalog-customer@example.com",
        "password": "test-customer-password",
    }
    assert (
        catalog_client.post("/api/auth/register", json=credentials).status_code == 201
    )
    customer = login(catalog_client, credentials)
    for headers, expected in (({}, 401), (customer, 403)):
        assert (
            catalog_client.post(PRODUCTS_URL, headers=headers, json=PRODUCT).status_code
            == expected
        )
        assert (
            catalog_client.patch(
                url, headers=headers, json={"title": "Changed"}
            ).status_code
            == expected
        )
        assert catalog_client.delete(url, headers=headers).status_code == expected
    assert catalog_client.get(url).json() == product


def test_catalog_rejects_invalid_write_and_list_parameters(catalog_client, admin_token):
    for fields in (
        {"images": PRODUCT["images"][:2]},
        {"images": [*PRODUCT["images"][:2], "not-a-url"]},
        {"price": "12.345"},
        {"price": "100000000.00"},
        {"rating": 5.5},
        {"stock_quantity": -1},
        {"title": "   "},
    ):
        assert (
            catalog_client.post(
                PRODUCTS_URL, headers=admin_token, json={**PRODUCT, **fields}
            ).status_code
            == 422
        )

    for params in (
        {"page": 0},
        {"limit": 101},
        {"sort_by": "description"},
        {"order": "up"},
        {"min_rating": -1},
        {"min_price": 20, "max_price": 10},
    ):
        assert catalog_client.get(PRODUCTS_URL, params=params).status_code == 422

    product = create_product(catalog_client, admin_token)
    url = f"{PRODUCTS_URL}/{product['id']}"
    for patch in ({}, {"title": None}, {"deleted_at": None}):
        assert (
            catalog_client.patch(url, headers=admin_token, json=patch).status_code
            == 422
        )
    assert catalog_client.get(f"{PRODUCTS_URL}/0").status_code == 422
