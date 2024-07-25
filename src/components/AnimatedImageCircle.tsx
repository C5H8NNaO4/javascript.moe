import clsx from 'clsx';
import { easeIn, easeOut, motion, useScroll, useTransform } from 'framer-motion';
import { useContext } from 'react';
import { sectionCtx } from './AnimatedSection';

export type AnimatedImageCircleProps = {
    images: string[];
    alts: string[];
    className?: string
    size?: AnimatedImageCircleSize
}

const heights: Record<AnimatedImageCircleSize, number> = {
    sm: 320,
}

export enum AnimatedImageCircleSize {
    sm = 'sm'
}

export const AnimatedImageCircle = ({ images, className, size = AnimatedImageCircleSize.sm, alts }: AnimatedImageCircleProps) => {
    const clsn = clsx("relative rounded-full overflow-hidden my-auto", className)
    const imgHeight = heights[size];

    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });

    const imgFilter = useTransform(scrollYProgress, [0, 0.25], ["saturate(100%)", "saturate(30%)"])
    const opacity = useTransform(scrollYProgress, [0.2, 0.33], ["100%", "0%"], { ease: easeOut })
    const reverse = useTransform(scrollYProgress, [0.2, 0.33], ["0%", "100%"], { ease: easeIn })

    return <motion.div className={clsn} style={{
        borderRadius: '1000px',
        height: imgHeight + 'px',
        width: imgHeight + 'px',
        filter: imgFilter,
        backdropFilter: 'blur(12px)',
        boxShadow: '0px 0px 6px 1px black',
        // opacity,

        zIndex: 100,
    }}>
        <motion.div className="absolute h-full w-full" style={{ opacity, background: `url(${images[0]}) center / cover`, height: '100%' }} aria-label={alts[0]} />
        <motion.div className="absolute h-full w-full" style={{ opacity: reverse, background: `url(${images[1] || images[0]}) center / cover`, height: '100%' }} aria-label={alts[1]} />
    </motion.div>
}