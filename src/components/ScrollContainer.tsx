import { PropsWithChildren, RefObject } from "react";
import { useDiv } from "../hooks/useDiv";
import clsx from "clsx";

export const ScrollContainer = ({
  children,
  className,
  forwardRef,
}: PropsWithChildren<{
  className?: string;
  forwardRef?: RefObject<HTMLDivElement>;
}>) => {
  const ref = forwardRef || useDiv();
  const focus = () => {
    console.log("MOUSE OVER");
    if (
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName!
      )
    )
      ref.current?.focus();
  };

  return (
    <div
      tabIndex={0}
      ref={ref}
      onMouseMove={focus}
      className={clsx(
        "flex flex-col gap-[1px] relative overflow-y-auto outline-none max-h-full",
        className
      )}
    >
      {children}
    </div>
  );
};