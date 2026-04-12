import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ShopPage from "./pages/ShopPage/ShopPage.jsx";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage.jsx";
import DealsPage from "./pages/DealsPage/DealsPage.jsx";
import AboutPage from "./pages/AboutPage/AboutPage.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import CartToast from "./components/CartToast/CartToast";
import { useCart } from "./context/CartContext";
import "./App.css";

function App() {
  const { isToastVisible, toastMessage, hideToast } = useCart();

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

      <CartToast
        isVisible={isToastVisible}
        message={toastMessage}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;