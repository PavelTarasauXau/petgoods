import "./FiltersSidebar.css";

function FiltersSidebar({
  ratingFilters,
  onRatingChange,
  priceMinText,
  priceMaxText,
  onPriceMinChange,
  onPriceMaxChange,
  isOpen,
  onClose,
}) {
  const { gte5, gte4, gte3 } = ratingFilters;

  return (
    <aside className={`filters${isOpen ? " filters--open" : ""}`}>
      <div className="filters__header">
        <h2 className="filters__title">Filters</h2>
        <button
          type="button"
          className="filters__close"
          onClick={onClose}
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>

      <div className="filters__group">
        <h3 className="filters__subtitle">Rating</h3>
        <label className="filters__checkbox">
          <input
            type="checkbox"
            checked={gte5}
            onChange={(e) => onRatingChange("gte5", e.target.checked)}
          />
          <span>5+ Stars</span>
        </label>
        <label className="filters__checkbox">
          <input
            type="checkbox"
            checked={gte4}
            onChange={(e) => onRatingChange("gte4", e.target.checked)}
          />
          <span>4+ Stars</span>
        </label>
        <label className="filters__checkbox">
          <input
            type="checkbox"
            checked={gte3}
            onChange={(e) => onRatingChange("gte3", e.target.checked)}
          />
          <span>3+ Stars</span>
        </label>
      </div>

      <div className="filters__group">
        <h3 className="filters__subtitle">Price Range</h3>
        <div className="filters__price-labels">
          <span>Min</span>
          <span>Max</span>
        </div>
        <div className="filters__price-row">
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            className="filters__price-input"
            placeholder="0"
            aria-label="Minimum price"
            value={priceMinText}
            onChange={(e) => onPriceMinChange(e.target.value)}
          />
          <span className="filters__dash">-</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            className="filters__price-input"
            placeholder="Any"
            aria-label="Maximum price"
            value={priceMaxText}
            onChange={(e) => onPriceMaxChange(e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}

export default FiltersSidebar;
