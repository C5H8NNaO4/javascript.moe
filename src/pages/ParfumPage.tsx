import { getVH, scrollToTop } from "@/lib/util"
import { StickySection, sectionCtx } from "@/components/AnimatedSection"
import { BackgroundImage } from "@/components/BackgroundImage"
import { Parallax } from "@/components/anim/Parallax"
import {
    motion,
    useScroll, useTransform,
} from 'framer-motion';
import ArrowBack from '@/assets/arrowback.svg?react'
import { Link } from "react-router-dom"
import { useContext, useEffect, useRef } from "react";
import { AboutSectionProps } from "@/lib/types";

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { EnsureLanguage } from "@/components/EnsureLanguage";

export const PerfumePage = () => {
    const { t } = useTranslation();
    return <div className="relative">
        <EnsureLanguage path='/about' />
        <StickySection height='150lvh' >
            <SylvanDawn
                text={t('SylvanDawn')}
                title="Sylvan Dawn"
                bgSrc="/images/wallpaper/11.jpg"
                bgAlt="Depiction of my Sylvan Dawn Fragrance"
                imgSrc="/images/perfumes/SylvanDawn.jpg"
                imgAlt="Wooden Heart perfume depiction"
            />
        </StickySection >
        <StickySection height='150lvh' >
            <SylvanDawn
                title="Wooden Heart"
                text={t('WoodenHeart')}
                bgSrc="/images/wallpaper/9.jpg"
                bgAlt="Waldweg"
                imgSrc="/images/perfumes/woodenheart.jpeg"
                imgAlt="Depiction of my Wooden Heart Fragrance"
            />
        </StickySection >

    </div>
}

export const SylvanDawn = ({ text, title, bgSrc, bgAlt, imgAlt, imgSrc }: AboutSectionProps) => {
    const { ref: scrollRef } = useContext(sectionCtx);
    const innerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: scrollRef || undefined,
        offset: ["start start", "end end"]
    });

    // const { scrollYProgress: scrollInner } = useScroll({
    //     layoutEffect: false,
    //     container: innerRef || undefined,
    //     offset: ["start start", "end end"]
    // });

    const dist = getVH(50)
    const offset = -dist;
    const blur = useTransform(scrollYProgress, [0, 0.75], ['blur(4px)', 'blur(0px)'])
    const rblur = useTransform(scrollYProgress, [0, 0.75], ['brightness(100%) blur(0px) saturate(100%)', 'brightness(80%) blur(4px) saturate(140%)'])
    const background = useTransform(scrollYProgress, [0, 0.75], ['#FFFFFF11', '#00000033'])
    const overflowY = useTransform(scrollYProgress, [0, 0.75], ['hidden', 'auto']);
    const bi = useTransform(scrollYProgress, [0, 0.75], ['1000px', '4px']);

    const anchors = ['sylvan dawn', 'wooden heart']
    useEffect(() => {
        console.log(decodeURIComponent(window.location.hash.slice(1).toLowerCase()))
        const index = anchors.indexOf(decodeURIComponent(window.location.hash.slice(1).toLowerCase()))
        const pos = 0.5 + (index * 2);
        console.log("INDEX ", index, pos);
        if (index > -1) {
            console.log("Scroll")

            setTimeout(() => {

                window.scrollTo({ top: window.innerHeight * pos });

            }, 250)
        }
    })

    return <>
        <BackgroundImage src={bgSrc} alt={bgAlt} />
        <div className='w-[80ch] max-w-[calc(100vw-32px)] absolute top-0'>
            <Parallax distance={32 * 2} offset={32 * 1} className="flex" range={[0.75, 0]}>
                <Link to={`/${i18n.language}`} className="flex">
                    <ArrowBack style={{ fill: 'white' }} />
                    <h2>Back</h2>
                </Link>
            </Parallax>
            <Parallax distance={dist - 32 * 4} offset={offset + 32 * 2} range={[0.75, 0]} className="">
                <button
                    onClick={scrollToTop}
                >
                    <motion.div
                        ref={innerRef}
                        style={{
                            background,
                            backdropFilter: rblur,
                            overflowY
                        }}
                        className="flex flex-wrap gap-4 p-4 rounded-md shadow-lg shadow-black max-h-[calc(100svh-120px)] text-left" >
                        {/* <motion.div style={{ display: 'block' }} /> */}

                        <motion.img alt={imgAlt} style={{ x: 0, maxWidth: "20%", borderRadius: bi }} className=" absolute top-4 object-cover pr-4" src={imgSrc} />

                        <motion.p className="text-left ml-4 px-4 pl-[20%] whitespace-pre-line min-w-[50vw]" style={{ filter: blur, textShadow: '1px 1px 1px black' }}>{text}</motion.p>
                    </motion.div>
                </button>
            </Parallax>
            <Parallax
                distance={dist - 32 * 2} offset={offset + 32} className="w-fit absolute top-0 ml-4"
                range={[0.75, 0]}
            >
                <button
                    className="w-fit"
                    onClick={scrollToTop}
                >
                    <h1 style={{ textShadow: '0px 0px 3px black' }}>{title}</h1>
                </button>
            </Parallax>
        </div>
    </>
}