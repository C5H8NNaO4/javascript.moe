import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '../lib/hooks';
import { useContext, useState } from 'react';
import { sectionCtx } from './AnimatedSection';

export const AnimatedText = () => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const y = useParallax(scrollYProgress, 150, -296)
    const scale = useTransform(scrollYProgress, [0.25, 1], ['100%', '200%'])

    return <motion.h1 className='absolute top-5' style={{ y, scale, zIndex: 100 }}>
        Moritz Roessler
    </motion.h1>
}

export const AppearingText = ({ texts, slices }: { texts: string[], slices?: number[] }) => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const y = useParallax(scrollYProgress, 150, -296)
    const t2 = useTransform(scrollYProgress, [0, 1], [1, texts.length + 1])
    const boxShadow = useTransform(scrollYProgress, [0, 1], ['0px 0px 0px black', '0px 0px 12px black'])

    const [text, setText] = useState('');
    useMotionValueEvent(y, 'change', () => {
        // const l = Math.round(it.length * scrollYProgress.gette());
        // setText(it.slice(it.length - l, l));
        const p = t2.get();
        const curText = Math.min(texts.length - 1, Math.floor(p - 1));
        const pCur = p % 1
        console.log("CUR", pCur, curText)
        const it = texts[curText]
        const rand = it.split('').sort((a, b) => {


            return ((Math.random() - 0.5) * (1 - pCur)) * 2 + ((pCur) * (it.indexOf(a) - it.indexOf(b)))

        }).slice((slices || [])[curText] || 0).join('');

        const part1 = it.split('').slice((slices || [])[curText] || 0);
        const part = part1.map((_, i) => (Math.floor((pCur * 1.5) * (it.length - 1)) > i ? part1[i] : rand[i])).join('');
        const txt = it.slice(0, (slices || [])[curText] || 0) + part;
        setText(txt)
    })
    return <motion.h1 className='absolute top-5' style={{ y, zIndex: 100, textShadow: boxShadow }}>
        {text}
    </motion.h1>
}

export type BulletsProps = {
    data: { text: string, logo: any, href?: string }[]
}
export const Bullets = ({ data }: BulletsProps) => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        target: ref || undefined,
        offset: ["start start", "end end"]
    });



    const scale = useTransform(scrollYProgress, [0.8, 0.9], ["0%", "100%"])
    const scale1 = useTransform(scrollYProgress, [0.92, 1], ["0%", "100%"])
    const scale2 = useTransform(scrollYProgress, [0.75, 1], ["0%", "100%"])
    return <div className='flex flex-col absolute gap-2 text-white'>
        {data.map((e, i) => {
            return <motion.div style={{ scale: [scale, scale1, scale2][i] }} className='flex gap-1'>
                <e.logo width="36px" height="36px" />
                <h2><a href={e.href || '#'}>{e.text}</a></h2>
            </motion.div>
        })}
    </div >
}