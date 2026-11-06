from datetime import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, DateTime, Float, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="ck_products_price_non_negative"),
        CheckConstraint("stock_quantity >= 0", name="ck_products_stock_non_negative"),
        CheckConstraint("rating >= 0 AND rating <= 5", name="ck_products_rating_range"),
        CheckConstraint("cardinality(images) >= 3", name="ck_products_min_3_images"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), index=True)
    rating: Mapped[float] = mapped_column(Float, default=0, server_default="0", index=True)
    images: Mapped[list[str]] = mapped_column(ARRAY(String))
    stock_quantity: Mapped[int] = mapped_column(default=0, server_default="0")
    category: Mapped[str | None] = mapped_column(String(100))
    specs: Mapped[dict | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))