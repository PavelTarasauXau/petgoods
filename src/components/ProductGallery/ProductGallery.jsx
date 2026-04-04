import { useState } from "react";
import "./ProductGallery.css";

/** Пока в данных одна картинка — передаём её три раза, чтобы в слайдере было ≥3 кадра по ТЗ. */
function ProductGallery({ images, productTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images.length;
  const safeIndex = count > 0 ? activeIndex % count : 0;

  function goToPrevious() {
    setActiveIndex((i) => (i - 1 + count) % count);
  }

  function goToNext() {
    setActiveIndex((i) => (i + 1) % count);
  }

  if (count === 0) {
    return null;
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__viewport">
        <img
          src={images[safeIndex]}
          alt={`${productTitle} — view ${safeIndex + 1}`}
          className="product-gallery__image"
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

      <div className="product-gallery__dots" role="tablist" aria-label="Slide indicators">
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
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
