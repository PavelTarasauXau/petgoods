import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../../components/data/products";
import { useCart } from "../../context/CartContext.jsx";
import ProductGallery from "../../components/ProductGallery/ProductGallery.jsx";
import "./ProductPage.css";

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

  const relatedProducts = useMemo(() => {
    if (!product || !product.relatedIds) return [];
    return product.relatedIds
      .map((rid) => products.find((p) => p.id === rid))
      .filter(Boolean);
  }, [product]);

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

  const fullStars = "★".repeat(product.rating);
  const emptyStars = "☆".repeat(5 - product.rating);

  function handleAddToCart() {
    const count = Math.max(1, quantity);
    for (let i = 0; i < count; i += 1) {
      addLine(product);
    }
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(99, q + 1));
  }

  return (
    <div className="page page--product">
      <div className="container product-page">
        <nav className="product-page__breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="product-page__bc-sep" aria-hidden="true">/</span>
          <span className="product-page__bc-current">{product.category}</span>
          <span className="product-page__bc-sep" aria-hidden="true">/</span>
          <span className="product-page__bc-current product-page__bc-current--title">
            {product.title}
          </span>
        </nav>

        <Link to="/" className="product-page__back">
          ← Back to shop
        </Link>

        <div className="product-page__layout">
          {/* ── LEFT: gallery ── */}
          <div className="product-page__media">
            <ProductGallery
              images={galleryImages}
              productTitle={product.title}
            />
          </div>

          {/* ── RIGHT: info ── */}
          <div className="product-page__info">
            <p className="product-page__category">{product.category}</p>
            <h1 className="page__title product-page__title">{product.title}</h1>

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

            {/* Key Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="product-page__highlights">
                <p className="product-page__highlights-title">Key Highlights</p>
                <ul className="product-page__highlights-list">
                  {product.highlights.map((item, i) => (
                    <li key={i} className="product-page__highlights-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="product-page__description-block">
              <p className="product-page__description-title">Description</p>
              <p className="page__lead product-page__description">
                {product.description}
              </p>
            </div>

            {/* Quantity + Add to cart */}
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
              🛒 Add to Cart
            </button>

            {/* Technical Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="product-page__specs">
                <div className="product-page__specs-header">
                  <span className="product-page__specs-icon">📦</span>
                  <p className="product-page__specs-title">
                    Technical Specifications
                  </p>
                </div>
                <div className="product-page__specs-grid">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="product-page__spec-card">
                      <span className="product-page__spec-label">
                        {spec.label}
                      </span>
                      <span className="product-page__spec-value">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extended description accordion */}
            <details className="product-page__accordion">
              <summary className="product-page__accordion-summary">
                Extended description
              </summary>
              <div className="product-page__accordion-body">
                <p className="product-page__accordion-text">
                  {product.extendedDescription}
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="product-page__related">
            <h2 className="product-page__related-title">Related Products</h2>
            <div className="product-page__related-grid">
              {relatedProducts.map((rel) => {
                const relFull = "★".repeat(rel.rating);
                const relEmpty = "☆".repeat(5 - rel.rating);
                return (
                  <Link
                    key={rel.id}
                    to={`/product/${rel.id}`}
                    className="product-page__related-card"
                  >
                    <div className="product-page__related-img-wrap">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="product-page__related-img"
                      />
                    </div>
                    <div className="product-page__related-body">
                      <span className="product-page__related-category">
                        {rel.category}
                      </span>
                      <p className="product-page__related-name">{rel.title}</p>
                      <div className="product-page__related-stars">
                        <span className="product-page__stars product-page__stars--filled">
                          {relFull}
                        </span>
                        <span className="product-page__stars product-page__stars--empty">
                          {relEmpty}
                        </span>
                      </div>
                      <p className="product-page__related-price">
                        ${rel.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductPage;