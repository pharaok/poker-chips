import { getPointOnPill } from "@repo/utils";
import { useRef } from "react";

export default function Table({
  children,
  around,
}: {
  children: React.ReactNode;
  around?: React.ReactNode[];
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative flex aspect-[9/16] min-w-80 items-center justify-center rounded-full border-[24px] border-gray-950 bg-[radial-gradient(var(--tw-gradient-stops))] from-green-500 to-green-700 text-white before:pointer-events-none before:absolute before:inset-4 before:rounded-full before:border-2 before:border-green-400 md:aspect-[16/9] md:min-h-96">
      {children}
      <div ref={tableRef} className="pointer-events-none absolute inset-4">
        {tableRef.current &&
          around?.map((c, i, a) => {
            const { clientWidth, clientHeight } = tableRef.current!;
            const [x, y] = getPointOnPill(
              clientWidth,
              clientHeight,
              i / a.length,
            );

            return (
              <div
                key={i}
                className="pointer-events-auto absolute -translate-x-[50%] -translate-y-[50%]"
                style={{ left: x, top: y }}
              >
                {c}
              </div>
            );
          })}
      </div>
    </div>
  );
}
