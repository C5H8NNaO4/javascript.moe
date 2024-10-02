import { MotionValue, useTransform } from "framer-motion";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.ts"; // Fix the path
import { useEffect, useState } from "react";

export const useParallax = (
  value: MotionValue<number>,
  distance: number,
  offset: number,
  ease?: any,
  range?: [number, number]
) => {
  return useTransform(
    value,
    range || [1, 0],
    [-distance - offset, distance - offset],
    {
      ease,
    }
  );
};

const fullConfig = resolveConfig(tailwindConfig);
export type BP = keyof (typeof fullConfig)["theme"]["screens"];
export const getBreakpointValue = (value: BP): number =>
  +fullConfig.theme.screens[value].slice(
    0,
    fullConfig.theme.screens[value].indexOf("px")
  );

export const useCurrentBreakpoint = (): string => {
  let currentBreakpoint: string = "3xs";
  let biggestBreakpointValue = 0;
  const [, setWidth] = useState(window.innerWidth);
  for (const breakpoint of Object.keys(fullConfig.theme.screens) as BP[]) {
    const breakpointValue = getBreakpointValue(breakpoint);
    if (
      breakpointValue > biggestBreakpointValue &&
      window.innerWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint;
    }
  }

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });
  return currentBreakpoint;
};
