import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CartToast from "../components/CartToast/CartToast";
import { ToastContext } from "./useToast";

const TOAST_DURATION = 2500;

// Состояние уведомления хранится только здесь, а в контекст отдаются лишь
// стабильные функции — поэтому показ уведомления не перерисовывает потребителей.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(toastTimerRef.current);
  }, []);

  const hideToast = useCallback(() => {
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = null;
    setToast((previous) => ({ ...previous, isVisible: false }));
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimerRef.current);
    setToast({ message, isVisible: true });

    toastTimerRef.current = setTimeout(() => {
      setToast((previous) => ({ ...previous, isVisible: false }));
    }, TOAST_DURATION);
  }, []);

  const value = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <CartToast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}
