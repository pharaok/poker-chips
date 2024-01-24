import {
  ToggleButton as RAToggleButton,
  ToggleButtonProps,
} from "react-aria-components";

export default function ToggleButton(props: ToggleButtonProps) {
  return (
    <RAToggleButton
      {...props}
      className="rounded-full bg-gray-800 px-6 py-2 transition hover:bg-gray-700 data-[selected]:bg-gray-200 data-[selected]:text-gray-800"
    ></RAToggleButton>
  );
}
