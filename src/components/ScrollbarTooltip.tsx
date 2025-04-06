import { easeOut, motion, useScroll, useTransform } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { sectionCtx } from "./AnimatedSection";
import useOnClickOutside from "@/hooks/useOnClickOutside";

export const ScrollbarTooltip = () => {
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined, //ref || undefined,
    offset: ["start start", "end end"],
  });

  const [isOpen, setIsOpen] = useState(true);

  const y = useTransform(scrollYProgress, [0, 1], [0, screen.height / 9], {
    // ease:
  });

  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0], {
    ease: easeOut,
  });
  const scale = useTransform(scrollYProgress, [0, 0.11, 0.22], [1, 1.3, 1], {
    ease: easeOut,
  });

  const ref2 = useRef(null);
  useOnClickOutside(ref2, () => setIsOpen(false));

  return (
    <motion.div
      ref={ref2}
      style={{ y: y, opacity, scale }}
      className="z-[10000] bg-red-500 absolute right-0 top-10    "
      onClick={() => setIsOpen(false)}
    >
      <div id="drag" />
      <Tooltip
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id="dragtooltip"
        anchorSelect="#drag"
        place="left"
        className="relative"
      >
        <div>Drag me</div>
      </Tooltip>
      {/* Drag Me */}
    </motion.div>
  );
};

export const RisingSun = () => {
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined, //ref || undefined,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0.33, 0.55], [1, 0], {
    ease: easeOut,
  });
  const scale = useTransform(scrollYProgress, [0.33, 0.44], [1, 4], {
    ease: easeOut,
  });
  const rotate = useTransform(scrollYProgress, [0, 0.33], ["0deg", "180deg"], {
    ease: easeOut,
  });

  const ref2 = useRef(null);

  return (
    <motion.div
      ref={ref2}
      style={{
        rotate,
        opacity,
      }}
      className="z-[10000] bg-white/0 absolute  text-[48px]  "
    >
      <motion.div className="w-[470px] flex justify-between" style={{}}>
        <motion.span style={{ rotate, scale }}>🌞</motion.span>
        <motion.span style={{ rotate, scale }}>🥰</motion.span>
      </motion.div>
    </motion.div>
  );
};
