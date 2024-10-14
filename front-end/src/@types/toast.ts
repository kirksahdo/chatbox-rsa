export type ToastType = "success" | "danger";

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}
