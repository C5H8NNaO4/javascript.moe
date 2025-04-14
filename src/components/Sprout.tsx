import { useTransform, motion, useScroll } from "framer-motion";
import { useContext } from "react";
import { sectionCtx } from "./AnimatedSection";
import { Icon } from "./Icon";
import { getRandomInt } from "@/lib/util";

export const Sprout = ({ range = [0, 1], x, y, offset }: any) => {
  const { ref } = useContext(sectionCtx);

  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });

  const trans = useTransform(scrollYProgress, range, [0, 1.1]);
  const scale = useTransform(trans, [0, 1], [0, 8 * offset]);
  const opacity = useTransform(trans, [0, 0.49, 1], [0, 1, 0]);

  return (
    <motion.div
      style={{ scale, opacity, x, y }}
      className="absolute z-40  top-[49vh] text-red-600/40 "
    >
      <Icon icon="FaHeart" className="" />
    </motion.div>
  );
};

export const SproutingHearts = ({ n = 4 }) => {
  const arr = [...Array(n)].map(() => {
    return [
      getRandomInt(0, 7) / 10,
      getRandomInt(-(window.innerWidth / 2) + 48, -48 + window.innerWidth / 2),
      getRandomInt(
        -(window.innerHeight / 2) + 48,
        -48 + window.innerHeight / 2
      ),
    ];
  });
  console.log("ARR", arr);
  return arr.map(([offset, x, y]) => {
    return <Sprout range={[offset, 1]} offset={offset} x={x} y={y} />;
  });
};
