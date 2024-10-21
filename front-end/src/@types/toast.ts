export type ToastType = "success" | "danger" | "notification";

export interface ToastProps {
  message: string;
  author?: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export interface ToastContextType {
  addToast: (message: string, type: ToastType, author?: string) => void;
}
