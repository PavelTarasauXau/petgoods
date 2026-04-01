import { useMemo, useState } from "react";
import Hero from "../../components/Hero/Hero";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import CatalogToolbar from "../../components/CatalogToolbar/CatalogToolbar";
import ProductsGrid from "../../components/ProductsGrid/ProductsGrid";
import { products } from "../../components/data/products";
import "./ShopPage.css";

//have to add price range and sortings

const initialRatingFilters = { gte5: false, gte4: false, gte3: false };

function ShopPage() {
  const [ratingFilters, setRatingFilters] = useState(initialRatingFilters);

  const filteredProducts = useMemo(() => {
    const mins = [];
    if (ratingFilters.gte5) mins.push(5);
    if (ratingFilters.gte4) mins.push(4);
    if (ratingFilters.gte3) mins.push(3);
    if (mins.length === 0) return products;
    return products.filter((p) => mins.some((min) => p.rating >= min));
  }, [ratingFilters]);

  const handleRatingChange = (key, checked) => {
    setRatingFilters((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <>
      <Hero />

      <section className="shop">
        <div className="container shop__container">
          <FiltersSidebar
            ratingFilters={ratingFilters}
            onRatingChange={handleRatingChange}
          />

          <div className="shop__content">
            <CatalogToolbar productsCount={filteredProducts.length} />
            <ProductsGrid products={filteredProducts} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ShopPage;
