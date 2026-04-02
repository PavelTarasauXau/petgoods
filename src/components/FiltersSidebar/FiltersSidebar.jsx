import "./FiltersSidebar.css";

// Значения по умолчанию для полей цены, если пользователь очистил input
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 100;

function FiltersSidebar({
  ratingFilters,
  onRatingChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
}) {
  const { gte5, gte4, gte3 } = ratingFilters;

  function handleMinPriceChange(event) {
    const text = event.target.value;

    if (text === "") {
      onPriceMinChange(DEFAULT_MIN_PRICE);
      return;
    }

    const number = Number(text);
    if (!Number.isNaN(number)) {
      onPriceMinChange(number);
    }
  }

  function handleMaxPriceChange(event) {
    const text = event.target.value;

    if (text === "") {
      onPriceMaxChange(DEFAULT_MAX_PRICE);
      return;
    }

    const number = Number(text);
    if (!Number.isNaN(number)) {
      onPriceMaxChange(number);
    }
  }

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
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            className="filters__price-input"
            value={priceMin}
            onChange={handleMinPriceChange}
          />
          <span className="filters__dash">-</span>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            className="filters__price-input"
            value={priceMax}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>
    </aside>
  );
}

export default FiltersSidebar;
