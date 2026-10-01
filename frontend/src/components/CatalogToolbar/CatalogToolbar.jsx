import "./CatalogToolbar.css";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

function CatalogToolbar({
  productsCount,
  sortBy,
  onSortChange,
  onFiltersToggle,
  filtersOpen,
}) {
  return (
    <div className="catalog-toolbar">
      <div className="catalog-toolbar__left">
        <button
          type="button"
          className={`catalog-toolbar__filters-btn${filtersOpen ? " catalog-toolbar__filters-btn--active" : ""}`}
          onClick={onFiltersToggle}
        >
          ☰ Filters
        </button>
        <p className="catalog-toolbar__count">{productsCount} products</p>
      </div>
      <div className="catalog-toolbar__sort">
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="catalog-toolbar__select"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CatalogToolbar;
