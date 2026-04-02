import { useParams, Link } from "react-router-dom";
import { products } from "../../components/data/products";
import { useCart } from "../../context/CartContext.jsx";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const { addLine } = useCart();
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="page page--product">
        <div className="container">
          <p className="page__lead">Product not found.</p>
          <Link to="/" className="product-page__back">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  function handleAddToCart() {
    addLine(product);
  }

  return (
    <div className="page page--product">
      <div className="container product-page">
        <Link to="/" className="product-page__back">
          ← Back to shop
        </Link>

        <div className="product-page__layout">
          <div className="product-page__media">
            <img
              src={product.image}
              alt={product.title}
              className="product-page__image"
            />
          </div>

          <div className="product-page__info">
            <p className="product-page__category">{product.category}</p>
            <h1 className="page__title product-page__title">{product.title}</h1>
            <p className="product-page__price">${product.price.toFixed(2)}</p>
            <p className="page__lead product-page__description">
              {product.description}
            </p>

            <button
              type="button"
              className="product-page__add-btn"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
