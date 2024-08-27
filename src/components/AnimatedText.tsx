import { easeInOut, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '@/lib/hooks';
import { useContext, useRef, useState } from 'react';
import { sectionCtx } from '@/components/AnimatedSection';
import clsx from 'clsx';
import { getHeight } from '@/lib/util';
import { Link } from 'react-router-dom';
import i18n from 'i18next';

export const AnimatedText = () => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const y = useParallax(scrollYProgress, 150, screen.height * -0.55, easeInOut)
    const scale = useTransform(scrollYProgress, [0.25, 1], ['36px', '72px'])

    return <motion.h1 className='absolute top-5 text-center' style={{ y, fontSize: scale, lineHeight: scale, zIndex: 100 }}>
        Moritz Roessler
    </motion.h1>
}

export const MyName = () => {
    const { ref } = useContext(sectionCtx);
    const height = getHeight(ref?.current || null);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const { scrollYProgress: scrollYPage } = useScroll();

    const hRef = useRef<HTMLDivElement>(null);

    const distance = (height / 1.75) / 4;
    let marginBottom = 16;
    if (hRef.current) {
        marginBottom = +window.getComputedStyle(hRef.current).marginBottom.replace('px', '') / window.devicePixelRatio;
    }

    const offset = marginBottom;
    const trans = useTransform(scrollYProgress, [0, 0.75], [0, 1])

    const y = useParallax(trans, distance - offset, distance - offset, easeInOut)
    const opacity = useTransform(trans, [0.75, 1], [1, 0.1]);
    const fS = screen.width <= 452 ? 52 : 72;
    const fontSize = useTransform(trans, [0.25, 0.9], ['36px', screen.width <= 452 ? '52px' : '72px'])
    const shadow = useTransform(scrollYPage, [0, 0.05, 0.1, 0.15, 0.2], ['0px 0px 0px #FFFFFF', '0px 0px 8px #FFFFFF', '1px 1px 1px #333333', '0px 0px 0px #FFFFFF', '0px 0px 8px #FFFFFF']);

    const mRef = useRef<HTMLDivElement>(null);
    const oeRef = useRef<HTMLDivElement>(null);
    const [dist, setDist] = useState([4, -4]);


    const [distCenterM, distCenterOe] = dist;
    const mX = useTransform(trans, [0.8, 0.9], ['0px', ((distCenterM) + 'px')]);
    const oeX = useTransform(trans, [0.8, 0.9], ['0px', ((distCenterOe) + 'px')]);
    const scale = useTransform(trans, [0.8, 0.9, 0.95, 1], ["100%", "130%", "70%", "100%"])
    const mRect = mRef.current?.getBoundingClientRect() || null;
    const oeRect = oeRef.current?.getBoundingClientRect() || null;
    const cw = ((mRect?.width || 0) + (oeRect?.width || 0));
    const heightPipe = useTransform(trans, [0.95, 1], ["0px", 0.681 * cw + 'px'])
    const widthUS = useTransform(trans, [0.95, 1], ["0px", cw + 'px'])
    const yPpipe = useTransform(trans, [0.95, 1], [(fS * -0.25) + 'px', (0.25 * cw) + 'px'])
    const xUS = useTransform(trans, [0.95, 1], ['0px', -(mRect?.width || 0) + 'px'])
    const yUS = useTransform(trans, [0.95, 1], [0, -4])
    const shadowPipe = useTransform(trans, [0.97, 1], ["0px 0px 4px 2px #FFFFFF", "0px 0px 1px 0.5px #C0C0C0"])
    const fillPipe = useTransform(trans, [0.95, 1], ["#FFFFFFFF", "#FFFFFF00"])
    const bb = useTransform(trans, [0, 0.95, 1], ["2px solid white", "2px solid white", "0px solid white"])
    const scalePipe = useTransform(trans, [0.7, 0.9, 1], ["0%", "100%", "100%"])
    const wPipe = useTransform(trans, [0.5, 1], ["0px", "4px"])

    const color = useTransform(scrollYPage, [0, 0.05, 0.09, 0.2], ["#DDDDDDFF", "#EEEEEEFF", "#DDDDDDFF", "#FFFFFF33"]);

    useMotionValueEvent(trans, 'change', () => {
        if (trans.get() <= 1) {

            // const hWidth = ((mRect?.width || 0) + (oeRect?.width || 0)) / 2
            const distCenterM = -(mRect?.left || 0) + (window.innerWidth / 2) - (mRect?.width || 0)
            const distCenterOe = (window.innerWidth / 2) - (oeRect?.left || 0);
            setDist([distCenterM, distCenterOe])
        }
    })
    return <motion.h1 id="moe" ref={hRef} className='absolute bottom-0 text-center'
        style={{ y, fontSize, lineHeight: fontSize, zIndex: 100, textShadow: shadow, borderBottom: bb }}>
        <Link to={`/${i18n.language}/about`} >
            <span ref={mRef}>
                <motion.span style={{ x: mX, display: 'inline-block', scaleX: scale, color }}>
                    M
                    <motion.div className='inline-block rounded-full' style={{ width: wPipe, background: fillPipe, scale: scalePipe, x: -1, fontSize: '32px', y: yPpipe, height: heightPipe, boxShadow: shadowPipe }}></motion.div>
                </motion.span>
            </span>
            <motion.span style={{ opacity }}>oritz R</motion.span>
            <span ref={oeRef}>
                <motion.span style={{ x: oeX, display: 'inline-block', scaleX: scale, color }}>
                    oe
                    <motion.div className='absolute h-1 rounded-full' style={{ background: fillPipe, scale: scalePipe, y: yUS, fontSize: '32px', x: xUS, width: widthUS, boxShadow: shadowPipe }}></motion.div>
                </motion.span>
            </span>
            <motion.span style={{ opacity }}>ssler</motion.span>
        </Link>
    </motion.h1 >
}

export const AppearingText = ({ range = [0, 1], className, texts, slices, Component = motion.h1 }: { range?: number[], className?: string, texts: string[], slices?: number[], Component?: any }) => {
    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const trans = useTransform(scrollYProgress, range, [0, 1]);
    const dist = 110;
    const off = dist - getHeight(document.body) * 0.25;
    const y = useParallax(trans, dist, off, easeInOut);
    const t2 = useTransform(trans, [0, 1], [1, texts.length + 1])
    const boxShadow = useTransform(trans, [0, 1], ['0px 0px 0px black', '0px 0px 12px black'])

    const [text, setText] = useState(['', '']);
    const [, setRerender] = useState(0);
    const startMultiplier = 2;
    useMotionValueEvent(y, 'change', () => {
        const totalProgress = t2.get();
        const curText = Math.min(texts.length - 1, Math.floor(totalProgress - 1));
        const curProgress = totalProgress % 1
        const it = texts[curText]
        const slice = ((slices || [])[curText] || 0);

        /** We want the end result to be visible for half the time of the animation. */
        const start = Math.floor(
            Math.round((curProgress) * (it.length - slice - 1)) * startMultiplier)

        const rand = it.split('').slice(
            slice + start
        )

        rand.sort((a, b) => {
            return ((Math.random() - 0.5) * (1 - curProgress)) + ((curProgress) * (it.indexOf(a) - it.indexOf(b)))
        }).join('');

        const part1 = it.split('').slice((slices || [])[curText] || 0, ((slices || [])[curText] || 0) + start).join('')
        const part = rand.map((_, i) => (rand[i])).join('');
        const txt = [it.slice(0, (slices || [])[curText] || 0).concat(part1), part];
        setText(txt)

        if (curProgress >= 0.5) {
            setRerender(1);
        } else if (curProgress < 0.5) {
            setRerender(0)
        }
    })
    return <Component
        className={clsx('absolute text-center', className, { 'break-all': ((t2.get()) % 1) < (1 / startMultiplier) })} style={{ y, zIndex: 100, textShadow: boxShadow }}
    >
        <span>{text[0]}</span>
        <span style={{ color: '#FFFFFF33', textShadow: '0px 0px 7px white' }}>{text[1]}</span>
    </Component >
}

export type BulletsProps = {
    data: { text: string, logo: any, href?: string }[],
    className?: string
    offset: number;
    reverse?: boolean;
    range?: number[];
}
export const Bullets = ({ range = [0, 1], data, className, offset = 0.5, reverse }: BulletsProps) => {
    const { ref } = useContext(sectionCtx);

    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });

    const trans = useTransform(scrollYProgress, range, [0, 1])
    const boxShadow = useTransform(trans, [0, 1], ['0px 0px 0px black', '0px 0px 12px black'])


    const scale = useTransform(trans, [offset + 0.05 * 0, offset + 0.05 * 1], ["0%", "100%"])
    const gap = useTransform(trans, [offset + 0.05 * 3, offset + 0.05 * 4], ["32px", "8px"])
    const textWidth = useTransform(trans,
        [offset + 0.05 * 3, offset + 0.05 * 4],
        ["0px", "300px"]);
    const borderRadius = useTransform(trans, [offset + 0.05 * 2, offset + 0.05 * 3], ["32px", "0px"])
    const scale1 = useTransform(trans, [offset + 0.05 * 1, offset + 0.05 * 2], ["0%", "100%"])
    const scale2 = useTransform(trans, [offset + 0.05 * 2, offset + 0.05 * 3], ["0%", "100%"])
    const scale3 = useTransform(trans, [offset + 0.05 * 3, offset + 0.05 * 4], ["0%", "100%"])
    const bg = useTransform(trans, [0.9, 1], ["#00000000", "#00000099"])
    let scalings = [scale, scale1, scale2, scale3];


    return <motion.div className={clsx('flex flex-row flex-wrap text-white flex-grow-0 items-center justify-center', className)} style={{ gap }}>
        {
            data.map((e, i) => {
                const ele = reverse ? data.length - 1 - i : i;
                return <motion.a className="bullet" href={e.href || '#'}
                    tabIndex={-1}
                    style={{
                        display: 'block',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        scale: scalings[ele % 4],
                        boxShadow,
                        borderRadius,
                        alignItems: 'center',
                        justifyContent: 'center', padding: 8, backgroundColor: bg, y: 8

                    }}
                >
                    <motion.div

                        className='flex flex-grow-0'>
                        <e.logo width="36px" height="36px" />
                        <motion.h2
                            style={{
                                maxWidth: textWidth,
                            }}>
                            <div style={{ marginLeft: '8px' }}>
                                {e.text}
                            </div>
                        </motion.h2>
                    </motion.div>
                </motion.a>

            })
        }
    </motion.div >
}

export type BulletsRowsProps = {
    data: { text: string, logo: any, href?: string }[]
}

export const SlicedText = ({ range = [0, 1], className, texts, slices, Component = motion.h1 }: { range?: number[], className?: string, texts: string[], slices?: number[], Component?: any }) => {

    const { ref } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const trans = useTransform(scrollYProgress, range, [0, 1]);
    const dist = 110;
    const off = dist - getHeight(document.body) * 0.25;
    const y = useParallax(trans, dist, off, easeInOut);
    const t2 = useTransform(trans, [0, 1], [0, texts.length - 1])

    const boxShadow = useTransform(trans, [0, 1], ['0px 0px 0px black', '0px 0px 12px black'])

    const t = texts[Math.round(t2.get())];
    const [p, setP] = useState(0);

    const p1 = t.slice(0, t.length * p);
    const p2 = t.slice(p1.length);

    useMotionValueEvent(trans, 'change', () => {
        setP(t2.get() % 1)
    })

    return <Component
        className={clsx('absolute text-center', className, { 'break-all': ((t2.get()) % 1) < (1 / 1) })}
        style={{ y, zIndex: 100, textShadow: boxShadow }}
    >
        <span>{p1}</span>
        <span style={{ color: '#FFFFFF33', textShadow: '0px 0px 7px white' }}>{p2}</span>
    </Component>

}