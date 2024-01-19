import { X } from "lucide-react";
interface ModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Modal({
  visible,
  setVisible,
  title,
  children,
}: ModalProps) {
  return (
    <div
      className={`${
        visible ? "" : "pointer-events-none opacity-0"
      } fixed inset-0 z-50 bg-black/50 transition-all`}
      onClick={() => setVisible(false)}
    >
      <div
        className="fixed left-[50%] top-[50%] flex max-h-full w-80 max-w-full -translate-x-[50%] -translate-y-[50%] flex-col items-center gap-2 rounded-2xl bg-gray-900 p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4"
          onClick={() => setVisible(false)}
        >
          <X />
        </button>
        <h2 className="text-2xl uppercase">{title}</h2>
        {children}
      </div>
    </div>
  );
}
