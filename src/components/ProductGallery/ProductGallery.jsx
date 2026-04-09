import { useState, useRef } from "react";
import "./ProductGallery.css";

function ProductGallery({ images, productTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const animTimeoutRef = useRef(null);

  const count = images.length;
  const safeIndex = count > 0 ? activeIndex % count : 0;

  function triggerSlide(nextIndex, direction) {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setAnimDir(direction);
    setActiveIndex(nextIndex);
    animTimeoutRef.current = setTimeout(() => setAnimDir(null), 350);
  }

  function goToPrevious() {
    triggerSlide((safeIndex - 1 + count) % count, "slide-right");
  }

  function goToNext() {
    triggerSlide((safeIndex + 1) % count, "slide-left");
  }

  function goToIndex(i) {
    if (i === safeIndex) return;
    triggerSlide(i, i > safeIndex ? "slide-left" : "slide-right");
  }

  if (count === 0) return null;

  return (
    <div className="product-gallery">
      <div className="product-gallery__viewport">
        <img
          key={safeIndex}
          src={images[safeIndex]}
          alt={`${productTitle} — view ${safeIndex + 1}`}
          className={`product-gallery__image${animDir ? ` product-gallery__image--${animDir}` : ""}`}
        />
      </div>

      <div className="product-gallery__controls">
        <button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--next"
          onClick={goToNext}
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      <div
        className="product-gallery__dots"
        role="tablist"
        aria-label="Slide indicators"
      >
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === safeIndex}
            className={
              index === safeIndex
                ? "product-gallery__dot product-gallery__dot--active"
                : "product-gallery__dot"
            }
            onClick={() => goToIndex(index)}
            aria-label={`Show image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;