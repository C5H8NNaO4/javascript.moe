import { useScroll, motion, useTransform } from "framer-motion";
import { useContext } from "react";
import { sectionCtx } from "./AnimatedSection";

export const Overlay = () => {
  const { ref } = useContext(sectionCtx);

  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    // target: ref || undefined,
    offset: ["start start", "end end"],
  });
  const trans = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  const x = useTransform(trans, [0, 0.75], ["100%", "0%"]);
  const y = useTransform(trans, [0, 0.25], ["100%", "0%"]);
  return (
    <motion.svg
      className="absolute right-0 bottom-0"
      viewBox="0 0 300 300"
      style={{
        width: "300px",
        height: "300px",
        stroke: "1px red",
        mixBlendMode: "multiply",
        filter: "drop-shadow(0px 0px 3px)",
        x,
        y
      }}
    >
      <motion.path
        d="M 100 300 L 0 300 L 300 0 L 300 100 Z"
        style={{
          fill: "red",
          x,
          y,
        }}
      />
    </motion.svg>
  );
};
