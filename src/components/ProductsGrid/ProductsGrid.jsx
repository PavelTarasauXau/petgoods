import ProductCard from "../ProductCard/ProductCard";
import "./ProductsGrid.css";

function ProductsGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="products-grid__empty" role="status">
        No products match the selected filters.
      </p>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsGrid;
