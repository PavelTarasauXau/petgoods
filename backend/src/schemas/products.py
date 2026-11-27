from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal, Self, TypedDict

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    JsonValue,
    StringConstraints,
    model_validator,
)

Title = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
]
Description = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Price = Annotated[Decimal, Field(ge=0, max_digits=10, decimal_places=2)]
Rating = Annotated[float, Field(ge=0, le=5)]
Images = Annotated[list[HttpUrl], Field(min_length=3)]
StockQuantity = Annotated[int, Field(ge=0, le=2_147_483_647)]
Category = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]
Specs = dict[str, JsonValue]


class ProductCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Title
    description: Description
    price: Price
    images: Images
    rating: Rating = 0
    stock_quantity: StockQuantity = 0
    category: Category | None = None
    specs: Specs | None = None


class ProductPatch(TypedDict, total=False):
    __pydantic_config__ = ConfigDict(extra="forbid")

    title: Title
    description: Description
    price: Price
    images: Images
    rating: Rating
    stock_quantity: StockQuantity
    category: Category | None
    specs: Specs | None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    price: float
    rating: float
    images: list[str]
    stock_quantity: int
    category: str | None
    specs: JsonValue
    created_at: datetime


class ProductQuery(BaseModel):
    page: int = Field(default=1, ge=1, le=2_147_483_647)
    limit: int = Field(default=12, ge=1, le=100)
    search: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=255)] | None
    ) = None
    min_price: Price | None = None
    max_price: Price | None = None
    min_rating: Rating | None = None
    sort_by: Literal["price", "title"] = "title"
    order: Literal["asc", "desc"] = "asc"

    @model_validator(mode="after")
    def validate_price_range(self) -> Self:
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.min_price > self.max_price
        ):
            raise ValueError("min_price must be less than or equal to max_price")
        return self


class Pagination(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    limit: int


class ProductPage(BaseModel):
    items: list[ProductResponse]
    meta: Pagination
