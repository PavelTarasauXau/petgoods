import { Link } from "react-router-dom";
import "./Footer.css";

import pawIcon from "../../assets/paw.png";
import mailIcon from "../../assets/mail.png";
import twitterIcon from "../../assets/twitter.png";
import instagramIcon from "../../assets/instagram.png";
import facebookIcon from "../../assets/facebook.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-circle">
                <img src={pawIcon} alt="PawsStore logo" className="footer__logo-icon" />
              </span>
              <span className="footer__logo-text">PawsStore</span>
            </Link>

            <p className="footer__description">
              Your trusted source for premium pet supplies and accessories.
            </p>
          </div>

          <div className="footer__links-block">
            <h3 className="footer__title">Quick Links</h3>
            <nav className="footer__links">
              <Link to="/">Shop All</Link>
              <Link to="/">New Arrivals</Link>
              <Link to="/">Best Sellers</Link>
              <Link to="/">Sale Items</Link>
            </nav>
          </div>

          <div className="footer__links-block">
            <h3 className="footer__title">Customer Service</h3>
            <nav className="footer__links">
              <Link to="/">Contact Us</Link>
              <Link to="/">Shipping Info</Link>
              <Link to="/">Returns Policy</Link>
              <Link to="/">FAQ</Link>
            </nav>
          </div>

          <div className="footer__newsletter">
            <h3 className="footer__title">Newsletter</h3>
            <p className="footer__newsletter-text">
              Subscribe to get special offers and updates.
            </p>

            <form className="footer__form">
              <input
                type="email"
                placeholder="Your email"
                className="footer__input"
              />
              <button type="submit" className="footer__submit" aria-label="Subscribe">
                <img src={mailIcon} alt="" />
              </button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 PawsStore. All rights reserved.
          </p>

          <div className="footer__socials">
            <Link to="/" className="footer__social-link" aria-label="Facebook">
              <img src={facebookIcon} alt="" />
            </Link>
            <Link to="/" className="footer__social-link" aria-label="Twitter">
              <img src={twitterIcon} alt="" />
            </Link>
            <Link to="/" className="footer__social-link" aria-label="Instagram">
              <img src={instagramIcon} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;