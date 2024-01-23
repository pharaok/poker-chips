import { Button as RAButton, ButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function Button({
  card,
  className,
  children,
  ...props
}: { card?: true; className: string } & Omit<ButtonProps, "className">) {
  return (
    <RAButton
      {...props}
      className={twMerge(
        card
          ? "flex items-center justify-between gap-2 rounded-full border-2 border-black bg-white px-6 py-2 text-black transition hover:bg-neutral-200 active:bg-neutral-300"
          : "rounded-full bg-gray-800 px-6 py-2 transition hover:bg-gray-700 active:bg-gray-600",
        className,
      )}
    >
      {children}
    </RAButton>
  );
}
