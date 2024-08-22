import { motion, useScroll, useTransform } from 'framer-motion'
import { useParallax } from '@/lib/hooks';
import { useContext } from 'react';
import { sectionCtx } from '@/components/AnimatedSection';
export type BackgroundImageProps = {
    src?: string;
    invert?: boolean
    desat?: boolean;
    vanish?: number;
    alt?: string;
}
export const BackgroundImage = ({ src, invert, desat, alt }: BackgroundImageProps) => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress: totalProgress } = useScroll({
        layoutEffect: false,
        // target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const y = useParallax(scrollYProgress, 50, 0)


    const scaledProgress = useTransform(totalProgress, [0, 0.18], [0, 1.3]);
    const imgFilter = useTransform(scaledProgress, invert ? [1.3, 1, 1, 0.75] : [0, 0.25, 1, 1.3], [
        "saturate(30%) blur(12px)",
        "saturate(100%) blur(0px)",
        "saturate(100%) blur(0px)",
        "saturate(100%) blur(12px)",
    ]);

    return <motion.div
        style={{
            position: 'absolute',
            height: '120lvh',
            boxShadow: '-3px 0px 30px 3px black',
            y,
        }}
    >
        <motion.img
            loading='lazy'
            src={src}
            alt={alt}
            style={{
                height: '120lvh',
                aspectRatio: 'initial',
                objectFit: 'cover',
                minWidth: '100vw',
                filter: desat ? imgFilter : undefined,
            }}
        />
        <div className='w-[300px] h-[300px] backdrop-blur-3xl bg-white z-50' />
    </motion.div>
}