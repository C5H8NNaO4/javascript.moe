import { getVH } from "@/lib/util"
import { StickySection, sectionCtx } from "@/components/AnimatedSection"
import { BackgroundImage } from "@/components/BackgroundImage"
import { Parallax } from "@/components/anim/Parallax"
import {
    motion,
    useScroll, useTransform,
} from 'framer-motion';
import ArrowBack from '@/assets/arrowback.svg?react'
import { Link } from "react-router-dom"
import { useContext, useEffect, useRef, useState, PropsWithChildren } from "react";
import { AboutSectionProps } from "@/lib/types";

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { EnsureLanguage } from "@/components/EnsureLanguage";
import { SylvanDawn, WoodenAmberHeart, WoodenHeart } from "@/assets/forulas";
import clsx from 'clsx';

export const PerfumePage = () => {
    const { t } = useTranslation();
    return <div className="relative">
        <EnsureLanguage path='/about' />
        <StickySection height='150lvh' >
            <PerfumeText
                text={t('SylvanDawn')}
                title="Sylvan Dawn"
                bgSrc="/images/wallpaper/11.jpg"
                bgAlt="Depiction of my Sylvan Dawn Fragrance"
                imgSrc="/images/perfumes/SylvanDawn.jpg"
                imgAlt="Wooden Heart perfume depiction"
                ingredients={SylvanDawn}
            />
        </StickySection >
        <StickySection height='150lvh' >
            <PerfumeText
                title="Wooden Heart"
                text={t('WoodenHeart')}
                bgSrc="/images/wallpaper/9.jpg"
                bgAlt="Waldweg"
                imgSrc="/images/perfumes/woodenheart.jpeg"
                imgAlt="Depiction of my Wooden Heart Fragrance"
                ingredients={WoodenHeart}
                variations={[{
                    title: 'Amber variation:',
                    ingredients: WoodenAmberHeart
                }]}
            />
        </StickySection >

    </div>
}

export const PerfumeText = ({ ingredients, variations = [], title, bgSrc, bgAlt, imgAlt, imgSrc }: AboutSectionProps) => {
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
    // const blur = useTransform(scrollYProgress, [0, 0.75], ['blur(4px)', 'blur(0px)'])
    const rblur = useTransform(scrollYProgress, [0, 0.75], ['brightness(100%) blur(0px) saturate(100%)', 'brightness(80%) blur(4px) saturate(140%)'])
    const background = useTransform(scrollYProgress, [0, 0.75], ['#FFFFFF11', '#00000033'])
    // const overflowY = useTransform(scrollYProgress, [0, 0.75], ['hidden', 'auto']);
    const bi = useTransform(scrollYProgress, [0, 0.75], ['1000px', '4px']);
    const opacity = useTransform(scrollYProgress, [0, 0.75], ['20%', '100%']);

    const anchors = ['sylvan dawn', 'wooden heart']
    // const { t } = useTranslation();
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
                // onClick={scrollToTop}
                >
                    <motion.div
                        ref={innerRef}
                        style={{
                            background,
                            backdropFilter: rblur,
                            // overflowY
                        }}
                        className="relative flex flex-col lg:flex-row  gap-4 p-4 rounded-md shadow-lg shadow-black max-h-[calc(100svh-120px)] text-left" >
                        {/* <motion.div style={{ display: 'block' }} /> */}

                        <motion.img alt={imgAlt} style={{ x: 0, borderRadius: bi, opacity }} className=" top-4 w-full lg:w-1/3 h-fit object-cover pr-4" src={imgSrc} />

                        {/* <motion.p className="text-left px-4  whitespace-pre-line " style={{ filter: blur, textShadow: '1px 1px 1px black' }}>{text}</motion.p> */}

                        <div>
                            <Recipe ingredients={ingredients || []} />
                            {variations.map((v) => {
                                return <>
                                    <p className="mt-2">{v.title}</p>
                                    <Recipe ingredients={v.ingredients}></Recipe>
                                </>
                            })}
                        </div>
                    </motion.div>
                </button>
            </Parallax>
            <Parallax
                distance={dist - 32 * 2} offset={offset + 32} className="w-fit absolute top-0 ml-4"
                range={[0.75, 0]}
            >
                <button
                    className="w-fit"
                // onClick={scrollToTop}
                >
                    <h1 style={{ textShadow: '0px 0px 3px black' }}>{title}</h1>
                </button>
            </Parallax>
        </div>
    </>
}

export type Explanation = {
    vol?: string;
    desc?: string;
    dil?: string;
    com?: string
}
export type Ingredient = {
    amount: string;
    name: string;
    dilution: number | null;
    company?: string
    exp: Explanation
}

export const Recipe = ({ ingredients }: { ingredients: Ingredient[] }) => {
    const [visible, setVisible] = useState<string | null>(null);
    const [part, setPart] = useState<keyof Explanation | null>(null);
    const to = useRef(0);
    const hide = () => {
        clearTimeout(to.current);
        to.current = setTimeout(() => {
            setPart(null);
        }, 250);
    }
    const Show = (part: keyof Explanation, show: boolean = true) => {
        return () => {
            clearTimeout(to.current);
            if (show && part) {
                setPart(part)
            }
            else setVisible(null);
        }
    }
    return <div>
        {ingredients.map((ing) => {
            const { amount, dilution, name, company, exp } = ing;
            return <div onMouseOver={() => setVisible(name)} onMouseLeave={() => setVisible(null)}>
                <p>
                    <span>
                        {'- '}
                    </span>
                    <span
                        onMouseEnter={Show('vol', !!exp.vol && exp.vol !== amount)} onMouseLeave={hide}
                    >{amount} </span>
                    <span
                        onMouseEnter={Show('desc')} onMouseLeave={hide}
                    >{name} </span>
                    {dilution !== null && <span
                        onMouseEnter={Show('dil', !!exp.dil)} onMouseLeave={hide}
                    >{dilution}% </span>}
                    {company && <span
                        onMouseEnter={Show('com')} onMouseLeave={hide}
                    > by {company} </span>}
                </p>
                <Tooltip visible={visible === name && !!part} onMouseEnter={() => {
                    clearTimeout(to.current);
                }}
                    onMouseLeave={hide}
                >
                    {part && exp[part]}
                </Tooltip>
            </div>
        })}
    </div >
}
export type TooltipProps = PropsWithChildren<{
    visible: boolean
    onMouseEnter?: any;
    onMouseLeave?: any;
}>

export const Tooltip = ({ children, visible, ...rest }: TooltipProps) => {
    if (!visible) return null;
    return <div className={clsx(
        "absolute w-full z-[10000] transition-opacity rounded-md bg-[rgba(0,0,0,0.681)] p-4 text-white",
        {
            'opacity-100': visible,
            'opacity-0': !visible,
            'h-0': !visible,
        }
    )}  {...rest} >
        {children}
    </div >
}