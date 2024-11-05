import { useRef } from "react";

export const useDiv = () => {
  return useRef<HTMLDivElement>(null);
};
