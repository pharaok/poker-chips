import {
  Slider as RASlider,
  SliderProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function Slider<T extends number>({
  className,
  ...props
}: { className: string } & Omit<SliderProps<T>, "className">) {
  return (
    <RASlider {...props} className={twMerge("w-full", className)}>
      <SliderTrack className="relative h-4 before:absolute before:top-[50%] before:block before:h-1 before:w-full before:-translate-y-[50%] before:rounded-full before:bg-gray-800 before:content-['']">
        <SliderThumb className="top-[50%] h-5 w-5 rounded-full bg-gray-600" />
      </SliderTrack>
    </RASlider>
  );
}
