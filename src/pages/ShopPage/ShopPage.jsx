import { useMemo, useState } from "react";
import Hero from "../../components/Hero/Hero";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import CatalogToolbar from "../../components/CatalogToolbar/CatalogToolbar";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { products } from "../../components/data/products";
import "./ShopPage.css";

const initialRatingFilters = { gte5: false, gte4: false, gte3: false };

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

function sortProducts(allProducts, sortOption) {
  const result = [...allProducts];
  if (sortOption === "name-asc")
    return result.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    );
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
  const [ratingFilters, setRatingFilters] = useState(initialRatingFilters);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [sortBy, setSortBy] = useState("name-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const productsToShow = useMemo(() => {
    let list = products;
    list = filterByRating(list, ratingFilters);
    list = filterByPrice(list, priceMin, priceMax);
    list = sortProducts(list, sortBy);
    return list;
  }, [ratingFilters, priceMin, priceMax, sortBy]);

  function handleRatingChange(filterKey, isChecked) {
    setRatingFilters((prev) => ({ ...prev, [filterKey]: isChecked }));
  }

  return (
    <>
      <Hero />
      <section className="shop">
        <div className="container shop__container">
          {/* Десктоп: сайдбар слева */}
          <FiltersSidebar
            ratingFilters={ratingFilters}
            onRatingChange={handleRatingChange}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />

          <div className="shop__content">
            <CatalogToolbar
              productsCount={productsToShow.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFiltersToggle={() => setFiltersOpen((prev) => !prev)}
              filtersOpen={filtersOpen}
            />
            {/* Мобилка: фильтры под тулбаром */}
            <div className="shop__mobile-filters">
              <FiltersSidebar
                ratingFilters={ratingFilters}
                onRatingChange={handleRatingChange}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                isOpen={filtersOpen}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
            <ProductsGrid products={productsToShow} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ShopPage;
