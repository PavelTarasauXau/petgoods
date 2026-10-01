import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products, findProduct } from "../../data/products";
import { useCart } from "../../context/useCart";
import { formatPrice, getStars } from "../../utils/format";
import ProductGallery from "../../components/ProductGallery/ProductGallery.jsx";
import NotFoundPage from "../NotFoundPage/NotFoundPage.jsx";
import "./ProductPage.css";
import boxIcon from "../../assets/box.png";

const MAX_QUANTITY = 99;

function getGalleryImages(product) {
  return product.images?.length ? product.images : [product.image];
}

function getRelatedProducts(product) {
  if (product.relatedIds?.length) {
    return product.relatedIds.map(findProduct).filter(Boolean);
  }

  return products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
}

function ProductPage() {
  const { id } = useParams();
  const product = findProduct(id);

  if (!product) {
    return <NotFoundPage message="Product not found." />;
  }

  // key сбрасывает локальное состояние (количество, раскрытые характеристики,
  // слайд галереи) при переходе на другой товар
  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specsOpen, setSpecsOpen] = useState(false);

  const stars = getStars(product.rating);
  const relatedProducts = getRelatedProducts(product);

  function handleAddToCart() {
    addItem(product, quantity);
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(MAX_QUANTITY, q + 1));
  }

  return (
    <div className="page page--product">
      <div className="product-page__topbar">
        <div className="container">
          <nav className="product-page__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="product-page__bc-sep">›</span>
            <Link to={`/?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
            <span className="product-page__bc-sep">›</span>
            <span
              className="product-page__bc-current product-page__bc-current--title"
              aria-current="page"
            >
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container product-page">
        <div className="product-page__layout">
          <div className="product-page__media">
            <ProductGallery
              images={getGalleryImages(product)}
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
                {stars.filled}
              </span>
              <span className="product-page__stars product-page__stars--empty">
                {stars.empty}
              </span>
              <span className="product-page__rating-text">
                {product.rating} out of 5 stars
              </span>
            </div>

            <p className="product-page__price">{formatPrice(product.price)}</p>

            {product.highlights?.length > 0 && (
              <section className="product-page__highlights">
                <h2 className="product-page__section-title">Key Highlights</h2>
                <ul className="product-page__highlights-list">
                  {product.highlights.map((item) => (
                    <li key={item} className="product-page__highlights-item">
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

            {product.specs?.length > 0 && (
              <section className="product-page__specs">
                <button
                  type="button"
                  className="product-page__specs-header"
                  onClick={() => setSpecsOpen((prev) => !prev)}
                  aria-expanded={specsOpen}
                >
                  <span className="product-page__specs-icon">
                    <img src={boxIcon} alt="" />
                  </span>
                  <span className="product-page__specs-title">
                    Technical Specifications
                  </span>
                  <span
                    className={`product-page__specs-arrow${specsOpen ? " product-page__specs-arrow--open" : ""}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                <div
                  className={`product-page__specs-body${specsOpen ? " product-page__specs-body--open" : ""}`}
                >
                  <div className="product-page__specs-grid">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="product-page__spec-card">
                        <div className="product-page__spec-top">
                          <span
                            className="product-page__spec-dot"
                            aria-hidden="true"
                          >
                            ◉
                          </span>
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
                </div>
              </section>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="product-page__related">
            <h2 className="product-page__related-title">Related Products</h2>

            <div className="product-page__related-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="product-page__related-card"
                >
                  <div className="product-page__related-image-wrap">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="product-page__related-image"
                    />
                  </div>

                  <div className="product-page__related-body">
                    <h3 className="product-page__related-name">
                      {relatedProduct.title}
                    </h3>
                    <p className="product-page__related-price">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
