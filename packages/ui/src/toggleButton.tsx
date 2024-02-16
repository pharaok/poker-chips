import {
  ToggleButton as RAToggleButton,
  ToggleButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function ToggleButton({
  className,
  ...props
}: { className: string } & Omit<ToggleButtonProps, "className">) {
  return (
    <RAToggleButton
      {...props}
      className={twMerge(
        "rounded-full bg-gray-800 px-6 py-2 transition hover:bg-gray-700 disabled:text-gray-500 data-[selected]:bg-white data-[selected]:text-gray-800",
        className,
      )}
    ></RAToggleButton>
  );
}
