import "./CatalogToolbar.css";

function CatalogToolbar({ productsCount }) {
  return (
    <div className="catalog-toolbar">
      <p className="catalog-toolbar__count">{productsCount} products</p>

      <div className="catalog-toolbar__sort">
        <span>Sort by:</span>
        <select defaultValue="name-asc" className="catalog-toolbar__select">
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
    </div>
  );
}

export default CatalogToolbar;