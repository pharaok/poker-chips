import { twMerge } from "tailwind-merge";
import Club from "./club";
import Diamond from "./diamond";
import Heart from "./heart";
import Spade from "./spade";

export default function Card({
  faceDown = false,
  className,
  style,
  children,
}: {
  faceDown?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: string;
}) {
  const rank = children?.slice(0, children.length - 1);
  const suit = children?.slice(children.length - 1);
  let suitComponent;
  switch (suit) {
    case "C":
      suitComponent = <Club className="h-full fill-current" />;
      break;
    case "D":
      suitComponent = <Diamond className="h-full fill-current" />;
      break;
    case "H":
      suitComponent = <Heart className="h-full fill-current" />;
      break;
    case "S":
      suitComponent = <Spade className="h-full fill-current" />;
      break;
  }
  return (
    <div
      className={twMerge(
        `relative flex h-20 aspect-[3/5] items-center justify-center rounded-md bg-white ${suit === "C" || suit === "S" ? "text-black" : "text-red-600"
        }`,
        className,
      )}
      style={style}
    >
      {faceDown ? (
        <div className="absolute inset-[2px] p-[2px] bg-red-600 rounded-md">
          <svg
            viewBox="0 0 30 50"
            preserveAspectRatio="none"
            className="h-full w-full fill-white"
          >
            <path

              d="M 1.875023,3.8304552e-5 2.2982731e-5,3.1250383 1.875023,6.2500383 l 1.875,-3.125 z m 1.875,3.124999995448 1.875,3.125 1.875,-3.125 -1.875,-3.124999995448 z m 3.75,0 1.8749999,3.1249998 1.8750001,-3.1249999 -1.875,-3.124999895448 z m 3.75,-10e-8 1.875,3.125 1.875,-3.1249999 -1.875,-3.124999995448 z m 3.75,10e-8 1.875,3.1250001 1.875,-3.1250001 -1.875,-3.124999995448 z m 3.75,0 1.875,3.1250001 1.875,-3.1250001 -1.875,-3.124999995448 z m 3.75,0 1.875,3.1250001 1.875,-3.1250001 -1.875,-3.124999995448 z m 3.75,0 1.875,3.1250001 1.875,-3.1250001 -1.875,-3.124999995448 z m 1.875,3.1250001 -1.875,3.125 1.875,3.1249996 1.875,-3.1249996 z m 0,6.2499996 -1.875,3.125 1.875,3.125001 1.875,-3.125001 z m 0,6.250001 -1.875,3.125 1.875,3.125 1.875,-3.125 z m 0,6.25 -1.875,3.125 1.875,3.125 1.875,-3.125 z m 0,6.25 -1.875,3.125 1.875,3.125 1.875,-3.125001 z m 0,6.25 -1.875,3.125 1.875,3.124999 1.875,-3.125 z m 0,6.249999 -1.875,3.125001 1.875,3.124999 1.875,-3.125 z m -1.875,3.125001 -1.875,-3.125 -1.875,3.125 1.875,3.125 z m -3.75,0 -1.875,-3.125 -1.875,3.125 1.875,3.125 z m -3.75,0 -1.875,-3.125 -1.875,3.125 1.875,3.125 z m -3.75,0 -1.875,-3.125 -1.875,3.124999 1.875,3.125001 z m -3.75,-10e-7 -1.8749998,-3.125 -1.875,3.125 1.875,3.125 z m -3.7499998,0 -1.8750001,-3.125 -1.875,3.125 1.875,3.125 z m -3.7500001,0 -1.8750001,-3.125 -1.875000017269,3.125 1.875000017269,3.125 z m -1.8750001,-3.125 1.8750001,-3.125 -1.8750001,-3.125 -1.875000017269,3.125 z m 0,-6.25 1.8750001,-3.125 -1.8750001,-3.125 -1.875000017269,3.125 z m 0,-6.25 1.8750001,-3.125 -1.8750001,-3.125 -1.875000017269,3.125 z m 0,-6.25 1.8749998,-3.125 -1.875,-3.125 -1.874999817269,3.125 z m -2e-7,-6.25 1.875,-3.125 -1.8749998,-3.125 -1.875000017269,3.125 z m 2e-7,-6.25 1.875,-3.1249998 -1.875,-3.1249999 L 2.2982731e-5,9.3750382 Z M 3.750023,9.3750382 5.6250228,12.500038 7.5000229,9.3750381 5.625023,6.2500383 Z m 3.7499999,-1e-7 1.875,3.1249999 L 11.250023,9.3750382 9.3750229,6.2500381 Z m 3.7500001,1e-7 1.875,3.1249998 1.875,-3.1249998 -1.875,-3.125 z m 3.75,0 1.875,3.1249998 1.875,-3.1249996 -1.875,-3.125 z m 3.75,2e-7 1.875,3.1249996 1.875,-3.1249996 -1.875,-3.125 z m 3.75,0 1.875,3.1249996 1.875,-3.1249996 -1.875,-3.125 z m 1.875,3.1249996 -1.875,3.125 1.875,3.125001 1.875,-3.125001 z m 0,6.250001 -1.875,3.124999 1.875,3.125001 1.875,-3.125 z m 0,6.25 -1.875,3.125 1.875,3.125 1.875,-3.125 z m 0,6.25 -1.875,3.125 1.875,3.125 1.875,-3.125 z m 0,6.25 -1.875,3.125 1.875,3.125 1.875,-3.125 z m -1.875,3.125 -1.875,-3.125 -1.875,3.125 1.875,3.125 z m -3.75,0 -1.875,-3.125001 -1.875,3.125 1.875,3.125001 z m -3.75,-10e-7 -1.875,-3.125 -1.875,3.125001 1.875,3.125 z m -3.75,10e-7 -1.8749998,-3.125001 -1.875,3.125 1.875,3.125 z m -3.7499998,-10e-7 -1.8750001,-3.125 -1.875,3.125 1.875,3.125 z m -1.8750001,-3.125 1.8750001,-3.125 -1.8750001,-3.125 -1.875,3.125 z m 0,-6.25 1.8749998,-3.125 -1.875,-3.125 -1.8749998,3.125 z m -2e-7,-6.25 1.875,-3.125 -1.875,-3.125 -1.8750001,3.125 z m 0,-6.25 1.875,-3.125 -1.8750001,-3.125 -1.875,3.125 z m 1.875,-3.125 1.875,3.125 1.8750001,-3.125 -1.8750001,-3.125 z m 3.7500001,0 1.875,3.125 1.875,-3.125 -1.875,-3.125 z m 3.75,0 1.875,3.125 1.875,-3.125 -1.875,-3.125 z m 3.75,0 1.875,3.125 1.875,-3.125 -1.875,-3.125 z m 1.875,3.125 -1.875,3.125 1.875,3.125001 1.875,-3.125001 z m 0,6.250001 -1.875,3.124999 1.875,3.125 1.875,-3.124999 z m 0,6.249999 -1.875,3.125001 1.875,3.125 1.875,-3.125 z m -1.875,3.125001 -1.875,-3.125001 -1.875,3.125 1.875,3.125 z m -3.75,-10e-7 -1.875,-3.125 -1.875,3.125 1.875,3.125 z m -3.75,0 -1.875,-3.125 -1.8749998,3.125 1.875,3.125 z m -1.875,-3.125 1.875,-3.125 -1.8750001,-3.125 -1.875,3.125 z m -1e-7,-6.25 1.8750001,-3.125 -1.8750001,-3.125 -1.875,3.125 z m 1.8750001,-3.125 1.875,3.125 1.875,-3.125 -1.875,-3.125 z m 3.75,0 1.875,3.125 1.875,-3.125 -1.875,-3.125 z m 1.875,3.125 -1.875,3.125 1.875,3.125 1.875,-3.125 z m -1.875,3.125 -1.875,-3.125 -1.875,3.125 1.875,3.125 z" />
          />
          </svg>
        </div>
      ) : (
        <>
          <span className="absolute left-1 top-0 text-xl">{rank}</span>
          <span className="absolute bottom-0 right-1 scale-[-1] text-xl">
            {rank}
          </span>
          <div className="h-6">{suitComponent}</div>
        </>
      )}
    </div>
  );
}
