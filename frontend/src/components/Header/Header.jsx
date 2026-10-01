import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "./Header.css";
import pawIcon from "../../assets/paw2.png";
import searchIcon from "../../assets/search.png";
import cartIcon from "../../assets/cart.png";

const NAV_LINKS = [
  { to: "/", label: "Shop", end: true },
  { to: "/categories", label: "Categories" },
  { to: "/deals", label: "Deals" },
  { to: "/about", label: "About" },
];

function Header() {
  const { totalItemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleSearch() {
    setSearchOpen((prev) => !prev);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
    setSearchOpen(false);
    closeMenu();
  }

  return (
    <header className="header">
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
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={toggleSearch}
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

      {searchOpen && (
        <form
          id="header-search"
          className="header__search"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="search"
            className="header__search-input"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="header__search-btn">
            Search
          </button>
        </form>
      )}

      <nav
        className={`header__mobile-nav${menuOpen ? " header__mobile-nav--open" : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
