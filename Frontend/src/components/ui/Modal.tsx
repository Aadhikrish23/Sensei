import { ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="
      fixed inset-0
      z-[9999]
      flex items-center justify-center
      bg-black/60
      backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
        relative
        w-[95%]
        max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        rounded-xl
        p-6
        bg-white dark:bg-[#1e1e24]
        text-black dark:text-white
        shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="
          absolute top-4 right-4
          text-xl
          text-gray-500
          hover:text-red-500
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}