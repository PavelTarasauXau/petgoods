const MAX_STARS = 5;

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export function getStars(rating) {
  const filledCount = Math.min(
    MAX_STARS,
    Math.max(0, Math.round(Number(rating) || 0)),
  );

  return {
    filled: "★".repeat(filledCount),
    empty: "☆".repeat(MAX_STARS - filledCount),
  };
}

export function pluralizeItems(count) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}
