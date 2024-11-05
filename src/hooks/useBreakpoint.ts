import { RefObject, useEffect, useState } from "react";

// TODO: Fix the path
import tailwindConfig from "../tailwind.config";

export type Breakpoint = keyof typeof tailwindConfig.theme.screens;

export const getBreakpointValue = (value: Breakpoint | "xs"): number => {
  if (value === "xs") return 0;

  const { ...screens } = tailwindConfig?.theme?.screens as Record<
    Breakpoint,
    string
  >;

  const width = screens[value] as string;
  return +width?.slice?.(0, width?.indexOf?.("px"));
};

export const useCurrentBreakpoint = (
  ref?: RefObject<HTMLElement>,
  initial: Breakpoint | "xs" = "xs"
): Breakpoint | "xs" => {
  const [width, setWidth] = useState(
    ref?.current?.getBoundingClientRect().width || document?.body?.clientWidth
  );

  let currentBreakpoint: Breakpoint | null | "xs" = initial;
  let biggestBreakpointValue = 0;

  useEffect(() => {
    if (!ref?.current) return;
    const onResize = () => {
      setWidth(
        ref?.current?.getBoundingClientRect().width || document.body.clientWidth
      );
    };
    // window.addEventListener("resize", onResize);
    const obs = new ResizeObserver(onResize);
    ref?.current && obs.observe(ref?.current);
    setTimeout(() => {
      onResize();
    }, 100);
    return () => obs.disconnect();
  }, [ref?.current]);

  useEffect(() => {
    setWidth(
      ref?.current?.getBoundingClientRect().width || document.body.clientWidth
    );
  }, [ref?.current]);

  for (const breakpoint of Object.keys(tailwindConfig?.theme?.screens || {})) {
    const breakpointValue = getBreakpointValue(breakpoint as Breakpoint);
    if (breakpointValue > biggestBreakpointValue && width >= breakpointValue) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint as Breakpoint;
    }
  }

  return currentBreakpoint;
};

export const isSmaller = (
  breakpoint: Breakpoint | "xs",
  reference: Breakpoint | "xs"
) => {
  return (
    (getBreakpointValue(breakpoint) || 0) < (getBreakpointValue(reference) || 0)
  );
};

export const isSmallerEq = (
  breakpoint: Breakpoint | "xs",
  reference: Breakpoint | "xs"
) => {
  return (
    (getBreakpointValue(breakpoint) || 0) <=
    (getBreakpointValue(reference) || 0)
  );
};
export const getLowestBreakpoint = (
  availableBreakpoints: Breakpoint[],
  currentBreakpoint: Breakpoint
) => {
  let biggest = availableBreakpoints[0];
  for (let i = 1; i < availableBreakpoints.length; i++) {
    const next = availableBreakpoints[i];
    if (isSmallerEq(next, currentBreakpoint)) {
      biggest = next;
    }
  }
  return biggest;
};
