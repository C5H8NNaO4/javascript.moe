import {
  easeIn,
  easeInOut,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { PropsWithChildren, useContext } from "react";
import { sectionCtx } from "@/components/AnimatedSection";
import { useParallax } from "@/lib/hooks";
import { IconButton } from "../Button";
import { useNavigate } from "react-router";

export type ParallaxProps = PropsWithChildren<{
  distance: number;
  offset?: number;
  range?: [number, number];
  className?: string;
  trans?: number[];
  style?: any;
}>;
export const Parallax = ({
  children,
  distance,
  className,
  offset = 0,
  range = [1, 0],
  trans = [1, 0],
  style = {},
}: ParallaxProps) => {
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });
  const t = useTransform(scrollYProgress, trans, range);
  const y = useParallax(t, distance, offset, easeIn, range);

  return (
    <motion.div className={className} style={{ y, ...style }}>
      {children}
    </motion.div>
  );
};

export const HeartButton = () => {
  const nav = useNavigate();
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });
  const t = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const x = useTransform(t, [0, 0.5, 1], [-(8 * 5), 8, -(4 * 1)], {
    ease: easeInOut,
  });
  //   const p = useTransform(t, [0.54, 0.59], [0, 8 * 2]);
  //   const r = useTransform(t, [0.5, 0.7], ["100% 100% 100% 100%", " 0% 100%  100% 0%"]);
  const o = useTransform(t, [0, 1], [0, 0.7], {ease: easeIn});

  const shadow = useTransform(
    t,
    [0, 0.5, 1],
    [
      "0px 0px 0px 0px rgb(220 38 38 / 0.4)",
      "0px 0px 4px 4px rgb(220 38 38 / 0.4)",
      "0px 0px 3px 1px rgb(220 38 38 / 0.4)",
    ],
    { ease: easeInOut }
  );
  return (
    <motion.div
      style={{
        opacity: o,

        x,
      }}
      className="flex w-full justify-start pl-4 my-auto"
    >
      <motion.div
        className="h-fit rounded-full"
        style={{
          boxShadow: shadow,
        }}
      >
        <IconButton
          onClick={() => {
            (window as any).noReset = true;
            nav("#love");
          }}
          icon="FaHeart"
          round
          className="z-50 bg-red-600/40 !border-red-700 hover:text-red-600 hover:bg-white/5 hover:blur-[1px]"
        />
      </motion.div>
    </motion.div>
  );
};
