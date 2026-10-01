import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { formatPrice, getStars } from "../../utils/format";
import "./ProductCard.css";
import cartIcon from "../../assets/cart.png";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { id, title, price, rating, reviews, image } = product;
  const stars = getStars(rating);
  const reviewCount =
    typeof reviews === "number" && !Number.isInteger(reviews)
      ? Math.round(reviews)
      : reviews;

  function handleAddToCartClick() {
    addItem(product);
  }

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <Link to={`/product/${id}`} className="product-card__image-link">
          <img src={image} alt={title} className="product-card__image" />
          <div className="product-card__price-badge">{formatPrice(price)}</div>
        </Link>

        <div className="product-card__overlay">
          <div className="product-card__overlay-box">
            <div aria-hidden="true">
              <h3 className="product-card__overlay-title">{title}</h3>
              <div className="product-card__overlay-rating">
                <span className="product-card__stars product-card__stars--filled">
                  {stars.filled}
                </span>
                <span className="product-card__stars product-card__stars--empty">
                  {stars.empty}
                </span>
                <span className="product-card__reviews">({reviewCount})</span>
              </div>
            </div>
            <div className="product-card__overlay-footer">
              <span className="product-card__overlay-price" aria-hidden="true">
                {formatPrice(price)}
              </span>
              <button
                type="button"
                className="product-card__cart-btn"
                onClick={handleAddToCartClick}
                aria-label={`Add ${title} to cart`}
              >
                <img
                  src={cartIcon}
                  alt=""
                  className="product-card__cart-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="product-card__body">
        <Link to={`/product/${id}`} className="product-card__title-link">
          <h3 className="product-card__title">{title}</h3>
        </Link>
        <div className="product-card__rating">
          <span className="product-card__stars product-card__stars--filled">
            {stars.filled}
          </span>
          <span className="product-card__stars product-card__stars--empty">
            {stars.empty}
          </span>
          <span className="product-card__reviews">({reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
