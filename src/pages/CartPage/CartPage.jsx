import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./CartPage.css";
import labelIcon from "../../assets/label.png";
import clockIcon from "../../assets/clock.png";
import locationIcon from "../../assets/location.png";
import binIcon from "../../assets/bin.png";

const TAX_RATE = 0.08;
const FREE_SHIPPING_MIN = 50;
const VALID_PROMO = "SAVE10";

function CartPage() {
  const { lines, increment, decrement, removeLine, subtotal } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(null);

  const itemCount = lines.reduce((n, line) => n + line.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const beforeDiscount = subtotal + tax;
  const discount = promoApplied ? beforeDiscount * 0.1 : 0;
  const orderTotal = beforeDiscount - discount;
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_MIN;

  function handlePromoApply(event) {
    event.preventDefault();
    const code = promoInput.trim();
    if (code === "") return;
    if (code === VALID_PROMO) {
      setPromoApplied(true);
      setPromoError(null);
      return;
    }
    setPromoError("Неверный промокод");
  }

  if (lines.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <div className="container cart-page__empty-inner">
          <div className="cart-page__empty-icon" aria-hidden="true">
            🛍
          </div>
          <h1 className="cart-page__empty-title">Your cart is empty</h1>
          <p className="cart-page__empty-text">
            Discover amazing products for your furry friends!
          </p>
          <Link to="/" className="cart-page__empty-cta">
            Start Shopping
            <span className="cart-page__empty-cta-arrow" aria-hidden="true">
              ›
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__topbar">
        <div className="container cart-page__container">
          <header className="cart-page__header">
            <div>
              <h1 className="cart-page__title">Shopping Bag</h1>
              <p className="cart-page__subtitle">
                {itemCount} {itemCount === 1 ? "item" : "items"} ready for
                checkout
              </p>
            </div>

            <ol className="cart-page__steps" aria-label="Checkout progress">
              <li className="cart-page__step cart-page__step--active">
                <span className="cart-page__step-number">1</span>
                <span>Cart</span>
              </li>
              <li className="cart-page__step">
                <span className="cart-page__step-number">2</span>
                <span>Checkout</span>
              </li>
              <li className="cart-page__step">
                <span className="cart-page__step-number">3</span>
                <span>Complete</span>
              </li>
            </ol>
          </header>

          <div
            className={`cart-page__shipping-banner ${
              qualifiesFreeShipping ? "cart-page__shipping-banner--ok" : ""
            }`}
          >
            <span className="cart-page__shipping-left">
              <img
                src={labelIcon}
                alt=""
                className="cart-page__shipping-icon"
              />
              <span>
                Free shipping on orders over{" "}
                <strong>${FREE_SHIPPING_MIN}</strong>
              </span>
            </span>

            {qualifiesFreeShipping ? (
              <span className="cart-page__shipping-qualified">
                Qualified! <span aria-hidden="true">✓</span>
              </span>
            ) : (
              <span className="cart-page__shipping-hint">
                Add ${(FREE_SHIPPING_MIN - subtotal).toFixed(2)} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container cart-page__container cart-page__content">
        <div className="cart-page__grid">
          <ul className="cart-page__items">
            {lines.map((line) => {
              const lineTotal = line.price * line.quantity;

              return (
                <li key={line.lineId} className="cart-line">
                  <Link
                    to={`/product/${line.productId}`}
                    className="cart-line__image-link"
                  >
                    <img src={line.image} alt="" className="cart-line__thumb" />
                  </Link>

                  <div className="cart-line__main">
                    <Link
                      to={`/product/${line.productId}`}
                      className="cart-line__title-link"
                    >
                      <h2 className="cart-line__title">{line.title}</h2>
                    </Link>

                    <p className="cart-line__category">{line.category}</p>

                    <div className="cart-line__row">
                      <div className="cart-line__qty">
                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          onClick={() => decrement(line.lineId)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="cart-line__qty-value">
                          {line.quantity}
                        </span>

                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          onClick={() => increment(line.lineId)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-line__prices">
                        <span className="cart-line__line-total">
                          ${lineTotal.toFixed(2)}
                        </span>
                        <span className="cart-line__each">
                          ${line.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cart-line__remove"
                    onClick={() => removeLine(line.lineId)}
                    aria-label={`Remove ${line.title}`}
                  >
                    <img src={binIcon} alt="" />
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="cart-summary">
            <div className="cart-summary__head">
              <h2 className="cart-summary__head-title">Order Summary</h2>
              <p className="cart-summary__head-sub">
                {itemCount} items in your bag
              </p>
            </div>

            <div className="cart-summary__promo-label">
              <span className="cart-summary__promo-label-icon">
                <img src={labelIcon} alt="" />
              </span>
              <span>Promo Code</span>
            </div>

            <form className="cart-summary__promo" onSubmit={handlePromoApply}>
              <input
                type="text"
                className="cart-summary__promo-input"
                placeholder="Enter code"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError(null);
                }}
                aria-invalid={Boolean(promoError)}
                aria-describedby={promoError ? "promo-error" : undefined}
              />
              <button type="submit" className="cart-summary__promo-btn">
                Apply
              </button>
            </form>

            {promoError && (
              <p
                id="promo-error"
                className="cart-summary__promo-error"
                role="alert"
              >
                {promoError}
              </p>
            )}

            {promoApplied && (
              <p className="cart-summary__promo-ok">
                Promo SAVE10 applied (10% off)
              </p>
            )}

            <dl className="cart-summary__rows">
              <div className="cart-summary__row">
                <dt>Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>

              <div className="cart-summary__row">
                <dt>Tax (8%)</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>

              {promoApplied && (
                <div className="cart-summary__row cart-summary__row--muted">
                  <dt>Discount (10%)</dt>
                  <dd>−${discount.toFixed(2)}</dd>
                </div>
              )}

              <div className="cart-summary__row cart-summary__row--total">
                <dt>Total</dt>
                <dd>${orderTotal.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="cart-summary__meta">
              <div className="cart-summary__meta-card">
                <span className="cart-summary__meta-icon cart-summary__meta-icon--blue">
                  <img src={clockIcon} alt="" />
                </span>
                <div>
                  <p className="cart-summary__meta-title">Delivery Time</p>
                  <p className="cart-summary__meta-value">3–5 business days</p>
                </div>
              </div>

              <div className="cart-summary__meta-card">
                <span className="cart-summary__meta-icon cart-summary__meta-icon--purple">
                  <img src={locationIcon} alt="" />
                </span>
                <div>
                  <p className="cart-summary__meta-title">Shipping To</p>
                  <p className="cart-summary__meta-value">
                    123 Main Street, NY 10001
                  </p>
                </div>
              </div>
            </div>

            <button type="button" className="cart-summary__checkout">
              Proceed to Checkout
            </button>

            <Link to="/" className="cart-summary__continue">
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
