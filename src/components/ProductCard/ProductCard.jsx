import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { id, title, price, rating, reviews, image } = product;

  const fullStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img src={image} alt={title} className="product-card__image" />

        <div className="product-card__price-badge">${price.toFixed(2)}</div>

        <div className="product-card__hover-panel">
          <h3 className="product-card__hover-title">{title}</h3>

          <div className="product-card__hover-rating">
            <span className="product-card__stars product-card__stars--filled">
              {fullStars}
            </span>
            <span className="product-card__stars product-card__stars--empty">
              {emptyStars}
            </span>
            <span className="product-card__reviews">({reviews})</span>
          </div>

          <div className="product-card__hover-bottom">
            <span className="product-card__hover-price">${price.toFixed(2)}</span>
            <button className="product-card__cart-btn" type="button">
              🛒
            </button>
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
          <span className="product-card__reviews">({reviews})</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;