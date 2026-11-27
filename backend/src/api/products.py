from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response, status
from sqlalchemy import BigInteger, func, literal, or_, select, true, update
from sqlalchemy.orm import aliased

from src.api.auth import require_admin
from src.api.database_route import DatabaseRoute
from src.core.database import Session
from src.models import Product
from src.schemas.products import (
    Pagination,
    ProductCreate,
    ProductPage,
    ProductPatch,
    ProductQuery,
    ProductResponse,
)

router = APIRouter(
    prefix="/api/products",
    tags=["products"],
    route_class=DatabaseRoute,
    responses={503: {"description": "Database unavailable"}},
)

ProductId = Annotated[int, Path(ge=1, le=2_147_483_647)]


def product_not_found() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
    )


def database_values(values: dict) -> dict:
    if "images" in values:
        return {**values, "images": [str(url) for url in values["images"]]}
    return values


def product_order(product, query: ProductQuery):
    column = getattr(product, query.sort_by)
    return (column.desc() if query.order == "desc" else column.asc(), product.id.asc())


@router.get("")
async def list_products(
    query: Annotated[ProductQuery, Query()], session: Session
) -> ProductPage:
    conditions = [Product.deleted_at.is_(None)]
    if query.search:
        escaped = query.search.replace("/", "//").replace("%", "/%").replace("_", "/_")
        pattern = f"%{escaped}%"
        conditions.append(
            or_(
                Product.title.ilike(pattern, escape="/"),
                Product.description.ilike(pattern, escape="/"),
            )
        )
    if query.min_price is not None:
        conditions.append(Product.price >= query.min_price)
    if query.max_price is not None:
        conditions.append(Product.price <= query.max_price)
    if query.min_rating is not None:
        conditions.append(Product.rating >= query.min_rating)

    totals = (
        select(func.count(Product.id).label("total_items"))
        .where(*conditions)
        .subquery()
    )
    page = (
        select(Product)
        .where(*conditions)
        .order_by(*product_order(Product, query))
        .offset(literal((query.page - 1) * query.limit, type_=BigInteger))
        .limit(query.limit)
        .subquery()
    )
    product = aliased(Product, page)
    # One statement keeps the count and the page on the same database snapshot.
    statement = (
        select(product, totals.c.total_items)
        .select_from(totals.outerjoin(page, true()))
        .order_by(*product_order(product, query))
    )
    rows = (await session.execute(statement)).all()
    total_items = rows[0].total_items
    return ProductPage(
        items=[
            ProductResponse.model_validate(item) for item, _ in rows if item is not None
        ],
        meta=Pagination(
            total_items=total_items,
            total_pages=(total_items + query.limit - 1) // query.limit,
            current_page=query.page,
            limit=query.limit,
        ),
    )


@router.get("/{product_id}")
async def get_product(product_id: ProductId, session: Session) -> ProductResponse:
    product = await session.scalar(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    if product is None:
        raise product_not_found()
    return ProductResponse.model_validate(product)


@router.post(
    "", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)]
)
async def create_product(payload: ProductCreate, session: Session) -> ProductResponse:
    product = Product(**database_values(payload.model_dump()))
    session.add(product)
    await session.flush()
    result = ProductResponse.model_validate(product)
    await session.commit()
    return result


@router.patch("/{product_id}", dependencies=[Depends(require_admin)])
async def update_product(
    product_id: ProductId, payload: ProductPatch, session: Session
) -> ProductResponse:
    if not payload:
        raise HTTPException(
            status_code=422, detail="At least one product field is required"
        )
    product = await session.scalar(
        update(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
        .values(**database_values(payload))
        .returning(Product)
    )
    if product is None:
        raise product_not_found()
    result = ProductResponse.model_validate(product)
    await session.commit()
    return result


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_product(product_id: ProductId, session: Session) -> Response:
    deleted_id = await session.scalar(
        update(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
        .values(deleted_at=func.now())
        .returning(Product.id)
    )
    if deleted_id is None:
        raise product_not_found()
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
