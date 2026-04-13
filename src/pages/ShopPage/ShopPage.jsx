import { useMemo, useState } from "react";
import Hero from "../../components/Hero/Hero";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import CatalogToolbar from "../../components/CatalogToolbar/CatalogToolbar";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { products } from "../../components/data/products";
import "./ShopPage.css";
// Начальное состояние чекбоксов рейтинга (ничего не выбрано = показываем все товары)
const initialRatingFilters = {
  gte5: false,
  gte4: false,
  gte3: false,
};

/**
 * Оставляем товары, чей рейтинг подходит хотя бы одному включённому фильтру.
 * Если ни один чекбокс не нажат — возвращаем список как есть.
 */
function filterByRating(allProducts, ratingFilters) {
  const want5OrMore = ratingFilters.gte5;
  const want4OrMore = ratingFilters.gte4;
  const want3OrMore = ratingFilters.gte3;

  const noRatingFilter =
    !want5OrMore && !want4OrMore && !want3OrMore;

  if (noRatingFilter) {
    return allProducts;
  }

  return allProducts.filter((product) => {
    const matches5Plus = want5OrMore && product.rating >= 5;
    const matches4Plus = want4OrMore && product.rating >= 4;
    const matches3Plus = want3OrMore && product.rating >= 3;
    return matches5Plus || matches4Plus || matches3Plus;
  });
}

/**
 * Оставляем товары с ценой в диапазоне [min, max].
 * Если пользователь ввёл min больше max, границы меняются местами.
 */
function filterByPrice(allProducts, minPrice, maxPrice) {
  const rangeStart = Math.min(minPrice, maxPrice);
  const rangeEnd = Math.max(minPrice, maxPrice);

  return allProducts.filter(
    (product) => product.price >= rangeStart && product.price <= rangeEnd
  );
}

/**
 * Сортировка копии массива (исходный массив products не меняем).
 * sortOption — значение из <select> на тулбаре.
 */
function sortProducts(allProducts, sortOption) {
  const result = [...allProducts];

  if (sortOption === "name-asc") {
    result.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );
    return result;
  }

  if (sortOption === "name-desc") {
    result.sort((a, b) =>
      b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
    );
    return result;
  }

  if (sortOption === "price-asc") {
    result.sort((a, b) => a.price - b.price);
    return result;
  }

  if (sortOption === "price-desc") {
    result.sort((a, b) => b.price - a.price);
    return result;
  }

  // На случай неизвестного значения — как "по имени А-Я"
  result.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
  return result;
}

function ShopPage() {
  const [ratingFilters, setRatingFilters] = useState(initialRatingFilters);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [sortBy, setSortBy] = useState("name-asc");

  // Считаем список для сетки: фильтры → сортировка.
  // useMemo нужен, чтобы не пересчитывать на каждый рендер без смены фильтров/сортировки.
  const productsToShow = useMemo(() => {
    let list = products;

    list = filterByRating(list, ratingFilters);
    list = filterByPrice(list, priceMin, priceMax);
    list = sortProducts(list, sortBy);

    return list;
  }, [ratingFilters, priceMin, priceMax, sortBy]);

  function handleRatingChange(filterKey, isChecked) {
    setRatingFilters((previous) => ({
      ...previous,
      [filterKey]: isChecked,
    }));
  }

  return (
    <>
      <Hero />

      <section className="shop">
        <div className="container shop__container">
          <FiltersSidebar
            ratingFilters={ratingFilters}
            onRatingChange={handleRatingChange}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
          />

          <div className="shop__content">
            <CatalogToolbar
              productsCount={productsToShow.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <ProductsGrid products={productsToShow} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ShopPage;
