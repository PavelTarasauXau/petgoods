import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ShopPage from "./pages/ShopPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import DealsPage from "./pages/DealsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ShopPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;