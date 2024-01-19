import { MouseEvent } from "react";

interface ButtonProps {
  card?: true;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export default function Button({
  card,
  className,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={`${
        card
          ? "flex items-center justify-between gap-2 rounded-full border-2 border-black bg-white px-6 py-2 text-black transition hover:bg-neutral-200 active:bg-neutral-300"
          : "rounded-full bg-gray-800 px-6 py-2 transition hover:bg-gray-700 active:bg-gray-600"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
