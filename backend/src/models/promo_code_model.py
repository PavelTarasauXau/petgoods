from sqlalchemy import Boolean, CheckConstraint, String, true
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database import Base


class PromoCode(Base):
    __tablename__ = "promo_codes"
    
    __table_args__ = (
        CheckConstraint(
            "discount_percentage > 0 AND discount_percentage <= 100",
            name="ck_promo_codes_discount_range",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    discount_percentage: Mapped[int]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default=true())