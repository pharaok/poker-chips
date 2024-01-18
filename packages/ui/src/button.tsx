import { MouseEvent } from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => {};
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="flex items-center justify-between gap-2 rounded-full border-2 border-black bg-white px-4 py-2 transition hover:bg-neutral-200 active:bg-neutral-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
