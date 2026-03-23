import Hero from "../components/Hero/Hero";
import FiltersSidebar from "../components/FiltersSidebar/FiltersSidebar";
import CatalogToolbar from "../components/CatalogToolbar/CatalogToolbar";
import ProductsGrid from "../components/ProductsGrid/ProductsGrid";
import { products } from "../components/data/products";
import "./ShopPage.css";

function ShopPage() {
  return (
    <>
      <Hero />

      <section className="shop">
        <div className="container shop__container">
          <FiltersSidebar />

          <div className="shop__content">
            <CatalogToolbar productsCount={products.length} />
            <ProductsGrid products={products} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ShopPage;