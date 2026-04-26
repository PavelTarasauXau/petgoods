import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Header.css";
import pawIcon from "../../assets/paw2.png";
import searchIcon from "../../assets/search.png";
import cartIcon from "../../assets/cart.png";

function Header() {
  const { totalItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      {}
      <div className="header__container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-circle">
            <img
              src={pawIcon}
              alt="PawsStore logo"
              className="header__logo-icon"
            />
          </span>
          <span className="header__logo-text">PawsStore</span>
        </Link>

        <nav className="header__nav">
          <Link to="/">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            type="button"
            aria-label="Search"
          >
            <img src={searchIcon} alt="" />
          </button>
          <Link
            to="/cart"
            className="header__cart-link"
            aria-label="Shopping cart"
            onClick={closeMenu}
          >
            <span className="header__cart-wrap">
              <img src={cartIcon} alt="" />
              {totalItemCount > 0 && (
                <span className="header__cart-badge">{totalItemCount}</span>
              )}
            </span>
          </Link>

          <button
            className="header__burger"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        className={`header__mobile-nav${menuOpen ? " header__mobile-nav--open" : ""}`}
      >
        <Link to="/" onClick={closeMenu}>
          Shop
        </Link>
        <Link to="/categories" onClick={closeMenu}>
          Categories
        </Link>
        <Link to="/deals" onClick={closeMenu}>
          Deals
        </Link>
        <Link to="/about" onClick={closeMenu}>
          About
        </Link>
      </nav>
    </header>
  );
}

export default Header;
