import {
  Tooltip as RATooltip,
  OverlayArrow,
  TooltipProps,
} from "react-aria-components";

export default function Tooltip({
  children,
  ...props
}: { children: React.ReactNode } & Omit<TooltipProps, "children">) {
  return (
    <RATooltip
      {...props}
      className="-translate-y-2 rounded-lg bg-gray-900 px-4 py-1 text-center text-2xl text-white"
    >
      <OverlayArrow>
        <svg viewBox="0 0 8 8" className="block h-2 w-2 fill-gray-900">
          <path d="M 0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </RATooltip>
  );
}
