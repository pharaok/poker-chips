import {
  Tooltip as RATooltip,
  OverlayArrow,
  TooltipProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function Tooltip({
  children,
  placement,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & Omit<
  TooltipProps,
  "className"
>) {
  return (
    <RATooltip
      {...props}
      placement={placement}
      offset={8}
      className={({ placement, isEntering, isExiting }) => {
        console.log("exiting:", isExiting);
        let placementClasses = "";
        switch (placement) {
          case "top":
            placementClasses = "slide-up";
            break;
          case "right":
            placementClasses = "slide-right";
            break;
          case "bottom":
            placementClasses = "slide-down";
            break;
          case "left":
            placementClasses = "slide-left";
            break;
        }
        if (isEntering) placementClasses += " animate-slide-in";
        if (isExiting) placementClasses += " animate-slide-out";

        return twMerge(
          "rounded-lg bg-gray-900 px-4 py-1 text-center text-2xl text-white",
          placementClasses,
          className,
        );
      }}
    >
      <OverlayArrow>
        {({ placement }) => {
          let placementClasses = "";
          switch (placement) {
            case "right":
              placementClasses = "rotate-90";
              break;
            case "bottom":
              placementClasses = "rotate-180";
              break;
            case "left":
              placementClasses = "-rotate-90";
              break;
          }
          return (
            <svg
              viewBox="0 0 8 8"
              className={`block h-3 w-3 fill-gray-900 ${placementClasses}`}
            >
              <path d="M 0 0 L4 4 L8 0" />
            </svg>
          );
        }}
      </OverlayArrow>
      {children}
    </RATooltip>
  );
}
