import { useCallback, useEffect, useMemo, useState } from "react";
import { findProduct } from "../data/products";
import { CartContext } from "./useCart";
import { useToast } from "./useToast";

const STORAGE_KEY = "pawsstore-cart-v1";
const PROMO_STORAGE_KEY = "pawsstore-promo-v1";

const PROMO_CODES = {
  SAVE10: 0.1,
};

// В корзине храним только id товара и количество: название, цена и картинка
// берутся из каталога, поэтому не устаревают после изменения данных или пересборки.
function loadLinesFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];

    const quantities = new Map();
    for (const line of data) {
      const product = findProduct(line?.productId);
      const quantity = Math.floor(Number(line?.quantity));
      if (!product || !(quantity > 0)) continue;
      quantities.set(product.id, (quantities.get(product.id) ?? 0) + quantity);
    }

    return [...quantities].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  } catch {
    return [];
  }
}

function loadPromoFromStorage() {
  try {
    const code = localStorage.getItem(PROMO_STORAGE_KEY);
    return code in PROMO_CODES ? code : null;
  } catch {
    return null;
  }
}

function saveToStorage(key, value) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // localStorage может быть недоступен (например, приватный режим) —
    // тогда корзина просто не сохранится между перезагрузками.
  }
}

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const [lines, setLines] = useState(loadLinesFromStorage);
  const [promoCode, setPromoCode] = useState(loadPromoFromStorage);

  // useEffect используется для синхронизации с внешним миром (запись в localStorage)
  useEffect(() => {
    saveToStorage(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    saveToStorage(PROMO_STORAGE_KEY, promoCode);
  }, [promoCode]);

  // useCallback запоминает саму функцию между рендерами, чтобы её ссылка
  // не менялась и не вызывала лишних перерисовок у потребителей контекста
  const addItem = useCallback(
    (product, amount = 1) => {
      const quantityToAdd = Math.max(1, Math.floor(Number(amount)) || 1);

      setLines((previous) => {
        const exists = previous.some((line) => line.productId === product.id);

        if (exists) {
          return previous.map((line) =>
            line.productId === product.id
              ? { ...line, quantity: line.quantity + quantityToAdd }
              : line,
          );
        }

        return [
          ...previous,
          { productId: product.id, quantity: quantityToAdd },
        ];
      });

      showToast(`${product.title} added to cart!`);
    },
    [showToast],
  );

  const increment = useCallback((productId) => {
    setLines((previous) =>
      previous.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      ),
    );
  }, []);

  const decrement = useCallback((productId) => {
    setLines((previous) =>
      previous.flatMap((line) => {
        if (line.productId !== productId) return [line];
        if (line.quantity <= 1) return [];
        return [{ ...line, quantity: line.quantity - 1 }];
      }),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setLines((previous) =>
      previous.filter((line) => line.productId !== productId),
    );
  }, []);

  const applyPromo = useCallback((code) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!(normalizedCode in PROMO_CODES)) return false;
    setPromoCode(normalizedCode);
    return true;
  }, []);

  const items = useMemo(
    () =>
      lines.map((line) => ({
        product: findProduct(line.productId),
        quantity: line.quantity,
      })),
    [lines],
  );

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      increment,
      decrement,
      removeItem,
      totalItemCount,
      subtotal,
      promoCode,
      promoDiscountRate: promoCode ? PROMO_CODES[promoCode] : 0,
      applyPromo,
    }),
    [
      items,
      addItem,
      increment,
      decrement,
      removeItem,
      totalItemCount,
      subtotal,
      promoCode,
      applyPromo,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
