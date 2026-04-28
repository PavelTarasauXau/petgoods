import { useState } from "react";
import "./FiltersSidebar.css";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 100;

function FiltersSidebar({
  ratingFilters,
  onRatingChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  isOpen,
  onClose,
}) {
  const { gte5, gte4, gte3 } = ratingFilters;

  const [minText, setMinText] = useState(String(priceMin));
  const [maxText, setMaxText] = useState(String(priceMax));

  function handleMinChange(e) {
    const text = e.target.value;
    setMinText(text);
    if (text === "") {
      onPriceMinChange(0);
      return;
    }
    const n = Number(text);
    if (!Number.isNaN(n)) onPriceMinChange(n);
  }

  function handleMaxChange(e) {
    const text = e.target.value;
    setMaxText(text);
    if (text === "") {
      onPriceMaxChange(9999);
      return;
    }
    const n = Number(text);
    if (!Number.isNaN(n)) onPriceMaxChange(n);
  }

  function handleMinBlur() {
    if (minText === "") setMinText("0");
  }

  function handleMaxBlur() {
    if (maxText === "") setMaxText("100");
  }

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
            value={minText}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
          />
          <span className="filters__dash">-</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            className="filters__price-input"
            value={maxText}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
          />
        </div>
      </div>
    </aside>
  );
}

export default FiltersSidebar;
