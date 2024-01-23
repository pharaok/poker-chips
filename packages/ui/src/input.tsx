import { Input as RAInput, InputProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
export default function Input({
  className,
  ...props
}: { className: string } & Omit<InputProps, "className">) {
  return (
    <RAInput
      {...props}
      className={twMerge(
        "w-full rounded-full bg-gray-800 px-6 py-2 text-white",
        className,
      )}
    />
  );
}
