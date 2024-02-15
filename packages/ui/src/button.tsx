import { Button as RAButton, ButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function Button({
  kind,
  children,
  ...props
}: { kind?: "card" | "primary"; className?: string } & Omit<
  ButtonProps,
  "className"
>) {
  let className = "rounded-full px-6 py-2 ";
  switch (kind) {
    case "card":
      className +=
        "flex items-center justify-between gap-2 border-2 border-black bg-white text-black transition hover:bg-gray-300";
      break;
    case "primary":
      className +=
        "bg-white text-gray-800 enabled:hover:bg-gray-300 disabled:bg-gray-500";
      break;
    default:
      className +=
        "bg-gray-800 transition enabled:hover:bg-gray-700 disabled:text-gray-500";
      break;
  }

  return (
    <RAButton {...props} className={twMerge(className, props.className)}>
      {children}
    </RAButton>
  );
}
