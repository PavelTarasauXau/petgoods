import "./FiltersSidebar.css";

function FiltersSidebar({ ratingFilters, onRatingChange }) {
  const { gte5, gte4, gte3 } = ratingFilters;

  return (
    <aside className="filters">
      <h2 className="filters__title">Filters</h2>

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
          <input type="number" defaultValue="0" className="filters__price-input" />
          <span className="filters__dash">-</span>
          <input type="number" defaultValue="100" className="filters__price-input" />
        </div>
      </div>
    </aside>
  );
}

export default FiltersSidebar;
