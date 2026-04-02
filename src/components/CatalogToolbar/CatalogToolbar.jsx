import "./CatalogToolbar.css";

// Один список — и видно все варианты сортировки, и меньше дублирования в разметке
const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

function CatalogToolbar({ productsCount, sortBy, onSortChange }) {
  function handleSelectChange(event) {
    const newValue = event.target.value;
    onSortChange(newValue);
  }

  return (
    <div className="catalog-toolbar">
      <p className="catalog-toolbar__count">{productsCount} products</p>

      <div className="catalog-toolbar__sort">
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={handleSelectChange}
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
