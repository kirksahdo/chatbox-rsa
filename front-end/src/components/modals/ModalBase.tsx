import React from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  isPrimaryDisabled?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const ModalBase: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onPrimaryClick,
  title,
  children,
  isPrimaryDisabled,
  onSecondaryClick,
  primaryLabel,
  secondaryLabel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative gap-2 flex flex-col">
        <h2
          className="text-xl absolute right-3 top-2 cursor-pointer text-black"
          onClick={onClose}
        >
          {"x"}
        </h2>

        <h3 className="text-xl font-semibold w-full text-center text-gray-700">
          {title}
        </h3>

        {children}

        <div className="flex justify-end gap-2 border-t-4 border-t-purple-700">
          {secondaryLabel && (
            <button
              onClick={onSecondaryClick}
              className="bg-gray-300 hover:bg-gray-500 text-gray-700 px-4 py-2 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button
              onClick={onPrimaryClick}
              className="bg-purple-500 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              disabled={isPrimaryDisabled}
            >
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
