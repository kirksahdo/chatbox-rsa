import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import clsx from "clsx";
import { ToastProps } from "../@types/toast";

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={clsx(
        "flex items-center p-4 rounded-lg shadow-lg gap-3 transition-transform transform duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0",
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white",
      )}
      style={{ maxWidth: "300px" }}
    >
      {type === "success" ? (
        <AiOutlineCheckCircle className="text-2xl" />
      ) : (
        <AiOutlineCloseCircle className="text-2xl" />
      )}
      <span className="flex-grow">{message}</span>
      <button onClick={() => setIsVisible(false)}>
        <FiX className="text-white" />
      </button>
    </div>
  );
};

export default Toast;
