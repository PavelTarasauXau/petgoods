import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import CatalogToolbar from "../../components/CatalogToolbar/CatalogToolbar";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { products, maxProductPrice } from "../../data/products";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "./ShopPage.css";

const initialRatingFilters = { gte5: false, gte4: false, gte3: false };

function parsePrice(text, fallback) {
  if (text.trim() === "") return fallback;
  const value = Number(text);
  return Number.isNaN(value) ? fallback : value;
}

function filterByRating(allProducts, ratingFilters) {
  const { gte5, gte4, gte3 } = ratingFilters;
  if (!gte5 && !gte4 && !gte3) return allProducts;
  return allProducts.filter(
    (p) =>
      (gte5 && p.rating >= 5) ||
      (gte4 && p.rating >= 4) ||
      (gte3 && p.rating >= 3),
  );
}

function filterByPrice(allProducts, minPrice, maxPrice) {
  const start = Math.min(minPrice, maxPrice);
  const end = Math.max(minPrice, maxPrice);
  return allProducts.filter((p) => p.price >= start && p.price <= end);
}

function filterByCategory(allProducts, category) {
  if (!category) return allProducts;
  return allProducts.filter((p) => p.category === category);
}

function filterBySearch(allProducts, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return allProducts;
  return allProducts.filter((p) =>
    [p.title, p.category, p.description].some((text) =>
      text.toLowerCase().includes(normalizedQuery),
    ),
  );
}

function sortProducts(allProducts, sortOption) {
  const result = [...allProducts];
  if (sortOption === "name-desc")
    return result.sort((a, b) =>
      b.title.localeCompare(a.title, undefined, { sensitivity: "base" }),
    );
  if (sortOption === "price-asc")
    return result.sort((a, b) => a.price - b.price);
  if (sortOption === "price-desc")
    return result.sort((a, b) => b.price - a.price);
  return result.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
}

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  const [ratingFilters, setRatingFilters] = useState(initialRatingFilters);
  const [priceMinText, setPriceMinText] = useState("0");
  const [priceMaxText, setPriceMaxText] = useState(String(maxProductPrice));
  const [sortBy, setSortBy] = useState("name-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isCompact = useMediaQuery("(max-width: 1024px)");

  const priceMin = parsePrice(priceMinText, 0);
  const priceMax = parsePrice(priceMaxText, Infinity);

  const productsToShow = useMemo(() => {
    let list = products;
    list = filterBySearch(list, searchQuery);
    list = filterByCategory(list, category);
    list = filterByRating(list, ratingFilters);
    list = filterByPrice(list, priceMin, priceMax);
    list = sortProducts(list, sortBy);
    return list;
  }, [searchQuery, category, ratingFilters, priceMin, priceMax, sortBy]);

  function handleRatingChange(filterKey, isChecked) {
    setRatingFilters((prev) => ({ ...prev, [filterKey]: isChecked }));
  }

  function clearSearchParam(name) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(name);
      return next;
    });
  }

  // На широком экране панель стоит слева от каталога, на узком — под тулбаром.
  // Рендерим её в одном месте, чтобы не было двух копий с разным состоянием.
  const filtersSidebar = (
    <FiltersSidebar
      ratingFilters={ratingFilters}
      onRatingChange={handleRatingChange}
      priceMinText={priceMinText}
      priceMaxText={priceMaxText}
      onPriceMinChange={setPriceMinText}
      onPriceMaxChange={setPriceMaxText}
      isOpen={filtersOpen}
      onClose={() => setFiltersOpen(false)}
    />
  );

  const activeFilters = [
    searchQuery && {
      param: "q",
      label: `Search: “${searchQuery}”`,
    },
    category && {
      param: "category",
      label: `Category: ${category}`,
    },
  ].filter(Boolean);

  return (
    <>
      <Hero />
      <section className="shop">
        <div className="container shop__container">
          {!isCompact && filtersSidebar}

          <div className="shop__content">
            <CatalogToolbar
              productsCount={productsToShow.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFiltersToggle={() => setFiltersOpen((prev) => !prev)}
              filtersOpen={filtersOpen}
            />

            {activeFilters.length > 0 && (
              <ul className="shop__active-filters">
                {activeFilters.map((filter) => (
                  <li key={filter.param} className="shop__active-filter">
                    <span>{filter.label}</span>
                    <button
                      type="button"
                      className="shop__active-filter-remove"
                      onClick={() => clearSearchParam(filter.param)}
                      aria-label={`Remove filter ${filter.label}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isCompact && filtersSidebar}
            <ProductsGrid products={productsToShow} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ShopPage;
