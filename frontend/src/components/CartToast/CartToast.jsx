import "./CartToast.css";

function CartToast({ isVisible, message, onClose }) {
  return (
    <div
      className={isVisible ? "cart-toast cart-toast--visible" : "cart-toast"}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="cart-toast__icon" aria-hidden="true">
        ✓
      </div>

      <p className="cart-toast__text">{message}</p>

      <button
        type="button"
        className="cart-toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default CartToast;