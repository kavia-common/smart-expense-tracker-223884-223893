import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ show: () => {} });

// PUBLIC_INTERFACE
export const useToast = () => useContext(ToastContext);

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
