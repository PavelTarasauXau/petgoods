import { useParams, Link } from "react-router-dom";
import { products } from "../../components/data/products";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();
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

  return (
    <div className="page page--product">
      <div className="container product-page">
        <Link to="/" className="product-page__back">
          ← Back to shop
        </Link>
        <h1 className="page__title">{product.title}</h1>
        <p className="product-page__price">${product.price.toFixed(2)}</p>
        <p className="page__lead">{product.description}</p>
      </div>
    </div>
  );
}

export default ProductPage;
