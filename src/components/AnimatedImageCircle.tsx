import clsx from "clsx";
import {
  easeIn,
  easeOut,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useContext } from "react";
import { sectionCtx } from "@/components/AnimatedSection";

export type AnimatedImageCircleProps = {
  images: string[];
  alts: string[];
  className?: string;
  size?: AnimatedImageCircleSize;
};

const heights: Record<AnimatedImageCircleSize, number> = {
  sm: 320,
};

export enum AnimatedImageCircleSize {
  sm = "sm",
}

export const AnimatedImageCircle = ({
  images,
  className,
  size = AnimatedImageCircleSize.sm,
  alts,
}: AnimatedImageCircleProps) => {
  const clsn = clsx("relative rounded-full overflow-hidden my-auto aic", className);
  const imgHeight = heights[size];

  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });

  const imgFilter = useTransform(
    scrollYProgress,
    [0, 0.25],
    ["saturate(100%)", "saturate(30%)"]
  );
  const opacity = useTransform(scrollYProgress, [0.2, 0.27], ["80%", "10%"], {
    ease: easeOut,
  });
  const reverse = useTransform(scrollYProgress, [0.21, 0.33], ["0%", "100%"], {
    ease: easeIn,
  });

  return (
    <motion.div
      className={clsn}
      style={{
        borderRadius: "1000px",
        height: imgHeight + "px",
        width: imgHeight + "px",
        filter: imgFilter,
        boxShadow: "0px 0px 6px 1px black",
        // opacity,
        backdropFilter: "blur(2px)",

        zIndex: 0,
      }}
    >
      <motion.img
        width={imgHeight + "px"}
        height={imgHeight + "px"}
        src={images[0]}
        loading="eager"
        className="csr absolute h-full w-full"
        style={{
          opacity,
          objectFit: "cover",
          height: "100%",
        }}
        alt={alts[0]}
      />
      <motion.img
        width={imgHeight + "px"}
        height={imgHeight + "px"}
        loading="lazy"
        src={images[1]}
        className="absolute h-full w-full"
        style={{
          opacity: reverse,
          objectFit: "cover",
          height: "100%",
        }}
        alt={alts[1]}
      />
    </motion.div>
  );
};
