import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "pawsstore-cart-v1";

const CartContext = createContext(null);

/** Уникальный id строки в корзине (один товар можно добавить несколько раз — разные строки). */
function newLineId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadLinesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadLinesFromStorage);

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // память или режим инкогнито — просто не сохраняем
    }
  }, [lines]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setIsToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2500);
  }, []);

  const hideToast = useCallback(() => {
    setIsToastVisible(false);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const addLine = useCallback(
    (product, amount = 1) => {
      const quantityToAdd = Math.max(1, Number(amount) || 1);

      const imageSrc =
        typeof product.image === "string"
          ? product.image
          : String(product.image);

      setLines((previous) => {
        const existingLine = previous.find(
          (line) => String(line.productId) === String(product.id),
        );

        if (existingLine) {
          return previous.map((line) =>
            String(line.productId) === String(product.id)
              ? { ...line, quantity: line.quantity + quantityToAdd }
              : line,
          );
        }

        const line = {
          lineId: newLineId(),
          productId: product.id,
          title: product.title,
          price: product.price,
          image: imageSrc,
          category: product.category ?? "General",
          quantity: quantityToAdd,
        };

        return [...previous, line];
      });

      showToast(`${product.title} added to cart!`);
    },
    [showToast],
  );

  const increment = useCallback((lineId) => {
    setLines((previous) =>
      previous.map((line) =>
        line.lineId === lineId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      ),
    );
  }, []);

  const decrement = useCallback((lineId) => {
    setLines((previous) =>
      previous.flatMap((line) => {
        if (line.lineId !== lineId) return [line];
        if (line.quantity <= 1) return [];
        return [{ ...line, quantity: line.quantity - 1 }];
      }),
    );
  }, []);

  const removeLine = useCallback((lineId) => {
    setLines((previous) => previous.filter((line) => line.lineId !== lineId));
  }, []);

  const totalItemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      addLine,
      increment,
      decrement,
      removeLine,
      totalItemCount,
      subtotal,
      toastMessage,
      isToastVisible,
      hideToast,
    }),
    [
      lines,
      addLine,
      increment,
      decrement,
      removeLine,
      totalItemCount,
      subtotal,
      toastMessage,
      isToastVisible,
      hideToast,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
