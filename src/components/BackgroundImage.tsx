import {
  easeIn,
  easeOut,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useParallax } from "@/lib/hooks";
import { useContext, useEffect, useState } from "react";
import { sectionCtx } from "@/components/AnimatedSection";
export type BackgroundImageProps = {
  src?: string | string[];
  invert?: boolean;
  desat?: boolean;
  vanish?: number;
  alt?: string;
};

export const FadingImage = ({
  src,
  alt,
  ...rest
}: {
  src: string | string[];
  alt?: string;
  className?: string;
  style?: any;
}) => {
  const srcs = Array.isArray(src) ? src : [src];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(0);

  useEffect(() => {
    setTimeout(() => setFade((fade + 1) % 100), 50);
  }, [fade]);

  useEffect(() => {
    if (fade === 0) {
      setIndex((index + 1) % srcs.length);
    }
  }, [fade]);
  return (
    <div {...rest} className="">
      <motion.img
        alt={alt}
        src={srcs[index]}
        style={{
          opacity: easeIn(1 - fade / 100),
          aspectRatio: "initial",
          objectFit: "cover",
        }}
        className=""
      />
      <motion.img
        alt={alt}
        src={srcs[(index + 1) % srcs.length]}
        style={{
          opacity: easeOut(fade / 100),
          aspectRatio: "initial",
          objectFit: "cover",
        }}
        className="absolute top-0"
      />
    </div>
  );
};
export const BackgroundImage = ({
  src,
  invert,
  desat,
  alt,
}: BackgroundImageProps) => {
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress: totalProgress } = useScroll({
    layoutEffect: false,
    // target: ref || undefined,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });
  const y = useParallax(scrollYProgress, 50, 0);

  const scaledProgress = useTransform(totalProgress, [0, 0.18], [0, 1.3]);
  const imgFilter = useTransform(
    scaledProgress,
    invert ? [1.3, 1, 1, 0.75] : [0, 0.25, 1, 1.3],
    [
      "saturate(30%) blur(12px)",
      "saturate(100%) blur(0px)",
      "saturate(100%) blur(0px)",
      "saturate(100%) blur(12px)",
    ]
  );

  const srcs = Array.isArray(src) ? src : [src];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    setTimeout(() => setFade(2), 12500);
  }, [index]);

  useEffect(() => {
    if (fade > 1) {
      setTimeout(() => setFade((fade + 1) % 100), 25);
    }
  }, [fade]);

  useEffect(() => {
    if (fade === 0) {
      setIndex((index + 1) % srcs.length);
    }
  }, [fade]);
  return (
    <motion.div
      className="h-[120vh] h-[120lvh] w-full"
      style={{
        position: "absolute",
        boxShadow: "-3px 0px 30px 3px black",
        y,
      }}
    >
      <motion.img
        className="h-[120vh] h-[120lvh] absolute right-0 left-0 w-[100vw]"
        loading="lazy"
        src={srcs[index]}
        alt={alt}
        style={{
          opacity: easeIn(1 - fade / 100),
          aspectRatio: "initial",
          objectFit: "cover",
          minWidth: "100vw",
          filter: desat ? imgFilter : undefined,
        }}
      />
      <motion.img
        className="h-[120vh] h-[120lvh] absolute right-0 left-0 w-full"
        loading="lazy"
        src={srcs[(index + 1) % srcs.length]}
        alt={alt}
        style={{
          opacity: easeOut(fade / 100),
          aspectRatio: "initial",
          objectFit: "cover",
          minWidth: "100vw",
          filter: desat ? imgFilter : undefined,
        }}
      />
      {/* <div className="w-[300px] h-[300px] backdrop-blur-3xl bg-white z-50" /> */}
    </motion.div>
  );
};
