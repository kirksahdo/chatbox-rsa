import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ToastContextType, ToastProps, ToastType } from "../@types/toast";
import Toast from "../components/Toast";
import ToastNotification from "../components/ToastNotification";

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType, author?: string) => {
      const toast: ToastProps = {
        message,
        type,
        author,
        onClose: () => {
          setToasts([...toasts.filter((t) => toast !== t)]);
        },
      };
      setToasts([toast, ...toasts]);

      setTimeout(() => {
        if (!toasts.some((t) => toast === t)) toast.onClose();
      }, toast.duration ?? 4000);
    },
    [toasts],
  );

  const value = useMemo(
    () => ({
      addToast,
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 space-y-3 z-50">
        {toasts.map((t, i) =>
          t.type === "notification" ? (
            <ToastNotification
              message={t.message}
              author={t.author ?? "none"}
              onClose={t.onClose}
              key={i}
            />
          ) : (
            <Toast
              message={t.message}
              onClose={t.onClose}
              type={t.type}
              key={i}
            />
          ),
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast should be used within a ToastProvider");
  }
  return context;
};
