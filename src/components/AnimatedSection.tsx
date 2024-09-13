import clsx from "clsx";
import { MutableRefObject, ReactElement, createContext, useRef } from "react";

export type AnimatedSectionProps = {
  height: string;
  children: ReactElement | ReactElement[];
  fullScreen?: boolean;
};

export const sectionCtx = createContext<{
  ref: MutableRefObject<HTMLDivElement | null> | null;
}>({ ref: null });
export const StickySection = (props: AnimatedSectionProps) => {
  const { height = "100lvh" } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <sectionCtx.Provider value={{ ref }}>
      <section
        className="w-full"
        ref={ref}
        style={{ height, minHeight: height }}
      >
        <div
          className={clsx(
            // 'h-[100lvh]',
            "min-h-[100vh]",
            "min-h-[100lvh]",
            "max-h-[100vh]",
            "max-h-[100lvh]",
            "w-full max-w-[100vw] ",
            "sticky top-0 flex gap-0 justify-center items-center overflow-hidden"
          )}
        >
          {props.children}
        </div>
      </section>
    </sectionCtx.Provider>
  );
};
