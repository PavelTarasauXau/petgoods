import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./ProductCard.css";
import cartIcon from "../../assets/cart.png";

function ProductCard({ product }) {
  const { addLine } = useCart();
  const { id, title, price, rating, reviews, image } = product;

  const fullStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  const reviewCount =
    typeof reviews === "number" && !Number.isInteger(reviews)
      ? Math.round(reviews)
      : reviews;

  function handleAddToCartClick(event) {
    event.preventDefault();
    event.stopPropagation();
    addLine(product);
  }

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img src={image} alt={title} className="product-card__image" />

        <div className="product-card__price-badge">${price.toFixed(2)}</div>

        <div className="product-card__overlay" aria-hidden="true">
          <div className="product-card__overlay-box">
            <h3 className="product-card__overlay-title">{title}</h3>

            <div className="product-card__overlay-rating">
              <span className="product-card__stars product-card__stars--filled">
                {fullStars}
              </span>
              <span className="product-card__stars product-card__stars--empty">
                {emptyStars}
              </span>
              <span className="product-card__reviews">({reviewCount})</span>
            </div>

            <div className="product-card__overlay-footer">
              <span className="product-card__overlay-price">
                ${price.toFixed(2)}
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
        <h3 className="product-card__title">{title}</h3>

        <div className="product-card__rating">
          <span className="product-card__stars product-card__stars--filled">
            {fullStars}
          </span>
          <span className="product-card__stars product-card__stars--empty">
            {emptyStars}
          </span>
          <span className="product-card__reviews">({reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
