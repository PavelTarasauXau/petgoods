import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../../components/data/products";
import { useCart } from "../../context/CartContext.jsx";
import ProductGallery from "../../components/ProductGallery/ProductGallery.jsx";
import "./ProductPage.css";
import boxIcon from "../../assets/box.png";

function buildGalleryImages(mainImage) {
  return [mainImage, mainImage, mainImage];
}

function ProductPage() {
  const { id } = useParams();
  const { addLine } = useCart();
  const product = products.find((p) => String(p.id) === String(id));

  const [quantity, setQuantity] = useState(1);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return buildGalleryImages(product.image);
  }, [product]);

  if (!product) {
    return (
      <div className="page page--product">
        <div className="container">
          <p className="page__lead">Product not found.</p>
          <Link to="/" className="product-page__fallback-link">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const fullStars = "★".repeat(product.rating);
  const emptyStars = "☆".repeat(5 - product.rating);

  function handleAddToCart() {
    const count = Math.max(1, quantity);
    addLine(product, count);
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(99, q + 1));
  }

  return (
    <div className="page page--product">
      <div className="product-page__topbar">
        <div className="container">
          <nav className="product-page__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="product-page__bc-sep">›</span>
            <span className="product-page__bc-current">{product.category}</span>
            <span className="product-page__bc-sep">›</span>
            <span className="product-page__bc-current product-page__bc-current--title">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container product-page">
        <div className="product-page__layout">
          <div className="product-page__media">
            <ProductGallery
              images={galleryImages}
              productTitle={product.title}
            />
          </div>

          <div className="product-page__info">
            <p className="product-page__category">{product.category}</p>

            <h1 className="product-page__title">{product.title}</h1>

            <div
              className="product-page__rating"
              aria-label={`Rating ${product.rating} out of 5`}
            >
              <span className="product-page__stars product-page__stars--filled">
                {fullStars}
              </span>
              <span className="product-page__stars product-page__stars--empty">
                {emptyStars}
              </span>
              <span className="product-page__rating-text">
                {product.rating} out of 5 stars
              </span>
            </div>

            <p className="product-page__price">${product.price.toFixed(2)}</p>

            {product.highlights && product.highlights.length > 0 && (
              <section className="product-page__highlights">
                <h2 className="product-page__section-title">Key Highlights</h2>
                <ul className="product-page__highlights-list">
                  {product.highlights.map((item, index) => (
                    <li key={index} className="product-page__highlights-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="product-page__description-block">
              <h2 className="product-page__section-title">Description</h2>
              <p className="product-page__description">{product.description}</p>
            </section>

            <div className="product-page__qty-row">
              <span className="product-page__qty-label">Quantity:</span>

              <div className="product-page__qty">
                <button
                  type="button"
                  className="product-page__qty-btn"
                  onClick={decreaseQty}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="product-page__qty-value">{quantity}</span>

                <button
                  type="button"
                  className="product-page__qty-btn"
                  onClick={increaseQty}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="product-page__add-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {product.specs && product.specs.length > 0 && (
              <section className="product-page__specs">
                <div className="product-page__specs-header">
                  <span className="product-page__specs-icon">
                    <img
                      src={boxIcon}
                      alt=""
                      className="product-card__cart-icon"
                    />
                  </span>
                  <h2 className="product-page__specs-title">
                    Technical Specifications
                  </h2>
                </div>

                <div className="product-page__specs-grid">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="product-page__spec-card">
                      <div className="product-page__spec-top">
                        <span className="product-page__spec-dot">◉</span>
                        <span className="product-page__spec-label">
                          {spec.label}
                        </span>
                      </div>
                      <span className="product-page__spec-value">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
