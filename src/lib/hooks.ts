import { MotionValue, useTransform } from "framer-motion";

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