import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import pawIcon from "../../assets/paw2.png";
import mailIcon from "../../assets/mail.png";
import twitterIcon from "../../assets/twitter.png";
import instagramIcon from "../../assets/instagram.png";
import facebookIcon from "../../assets/facebook.png";

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/", label: "Facebook", icon: facebookIcon },
  { href: "https://x.com/", label: "Twitter", icon: twitterIcon },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: instagramIcon,
  },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();
    setIsSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-circle">
                <img
                  src={pawIcon}
                  alt="PawsStore logo"
                  className="footer__logo-icon"
                />
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
              <Link to="/categories">Categories</Link>
              <Link to="/deals">Deals</Link>
              <Link to="/about">About</Link>
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

            <form className="footer__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                className="footer__input"
                aria-label="Your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsSubscribed(false);
                }}
              />
              <button
                type="submit"
                className="footer__submit"
                aria-label="Subscribe"
              >
                <img src={mailIcon} alt="" />
              </button>
            </form>

            {isSubscribed && (
              <p className="footer__form-note" role="status">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 PawsStore. All rights reserved.
          </p>

          <div className="footer__socials">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer__social-link"
                aria-label={link.label}
                target="_blank"
                rel="noreferrer"
              >
                <img src={link.icon} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
