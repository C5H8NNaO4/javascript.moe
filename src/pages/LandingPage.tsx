import { StickySection, sectionCtx } from '@/components/AnimatedSection'
import { AnimatedImageCircle } from '@/components/AnimatedImageCircle'
import { Container } from '@/components/Container'
import { AppearingText, Bullets, MyName } from '@/components/AnimatedText'
import TS from '@/assets/ts.svg?react';
import PDF from '@/assets/pdf.svg?react';
import ReactLogo from '@/assets/react.svg?react';
import LI from '@/assets/li.svg?react';
import GH from '@/assets/github.svg?react';
import StackOverflowLogo from '@/assets/stackoverflow.svg?react';
import AWSLogo from '@/assets/aws.svg?react';
import SQLLogo from '@/assets/sql.svg?react';
import NodeJSLogo from '@/assets/node.svg?react';
import VueJSLogo from '@/assets/vue.svg?react';
import DockerLogo from '@/assets/docker.svg?react';
import LambdaLogo from '@/assets/lambda.svg?react';
import { DualImages } from '@/components/BlendedImage'
import { Parallax } from '@/components/anim/Parallax'
import { FlyOut } from '@/components/anim/FlyOut'
import { EnsureLanguage } from '@/components/EnsureLanguage'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion'
import { useState, useContext } from 'react'
import 'swiper/css';
import { Link } from 'react-router-dom'
import i18n from 'i18next'

export const LandingPage = () => {

    const { scrollYProgress } = useScroll();
    const [swiper, setSwiper] = useState<any>(null);
    const index = useTransform(scrollYProgress, [0, 1], [0, 2])

    useMotionValueEvent(index, 'change', (i) => {
        swiper?.slideTo(i);
    })

    return (
        <>
            <EnsureLanguage path='' />
            <StickySection height='175lvh' >
                {/* <BackgroundImage src="/images/wallpaper/1.webp" desat alt="Moosweiher See in Freiburg" />
                
                */}
                <DualImages images={["/images/wallpaper/1.webp", "/images/wallpaper/me-ls.jfif"]} moveX={0} alts={[
                    'Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                    'Moritz Roessler am Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                ]} />
                <Parallax distance={320 * 0.5} offset={320 * 0.5}>
                    <FlyOut range={[0.25, 0.5]}>
                        <Container>
                            <AnimatedImageCircle images={["/images/profile.webp", "/images/profile2.webp"]} alts={['Profile picture of Moritz', 'Profile picture of Moritz with sunglasses']} />
                        </Container>
                    </FlyOut>
                </Parallax>
                <MyName />
            </StickySection >

            <StickySection height='400lvh' fullScreen>
                <Swiper className='h-[120vh] w-[100vw] sticky top-0 ' onSwiper={setSwiper} >

                    <SwiperSlide className='h-full w-full flex justify-center'>
                        <DualImages range={[0, 0.5]} images={["/images/wallpaper/3.webp", "/images/wallpaper/2.webp"]} moveX={2} alts={[
                            'Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                            'Moritz Roessler am Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                        ]} />
                        <AppearingText range={[0, 0.5]} className="top-[50vh]" texts={['Software Engineer', 'Fullstack Dev']} />
                        <Parallax trans={[0, 0.5]} className='absolute w-full flex flex-col items-center gap-2 mt-[50lvh]' distance={64} offset={-64}>
                            <Bullets range={[0, 0.5]} data={[
                                { text: 'TypeScript', logo: TS, href: 'https://www.typescriptlang.org/' },
                                { text: 'React', logo: ReactLogo, href: 'https://react.dev/' }
                            ]}
                                offset={0.6}
                            />
                            <Parallax trans={[0.5, 0]} distance={64} offset={-64} >
                                <Bullets range={[0, 0.5]} data={[
                                    { text: 'SQL', logo: SQLLogo, href: 'https://www.postgresql.org/' },
                                    { text: 'AWS', logo: AWSLogo, href: 'https://aws.amazon.com/de/console/' },
                                    { text: 'Node.js', logo: NodeJSLogo, href: 'https://nodejs.org/en' },
                                    { text: 'Vue.js', logo: VueJSLogo, href: 'https://vuejs.org/' },
                                    { text: 'Docker', logo: DockerLogo, href: 'https://www.docker.com/' },
                                    { text: 'Lambda', logo: LambdaLogo, href: 'https://aws.amazon.com/de/lambda/' },
                                ]}
                                    className="!flex-row"
                                    offset={0.75}
                                ></Bullets>
                            </Parallax>
                        </Parallax>

                    </SwiperSlide>

                    <SwiperSlide className='h-full w-full flex justify-center'>
                        <DualImages className="-z-10" range={[0.6, 1]} images={[
                            "/images/wallpaper/10.jpg",
                            "/images/wallpaper/9.jpg",
                            "/images/wallpaper/8.jpg",
                        ]} moveX={2} alts={[
                            'Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                            'Moritz Roessler am Weiher beim Park Hotel, Fasanerie in Neustrelitz',
                        ]} />
                        <AppearingText range={[0.75, 1]} className="top-[50vh]" texts={['Hobby Perfumer', 'Fine Fragrances']} />
                        <Parallax trans={[1, 0.75]} className='absolute w-full flex flex-col items-center gap-2 mt-[50lvh]' distance={32} offset={-32}>
                            <PerfumeLink range={[0.75, 1]} />
                        </Parallax>
                        {/* <Parallax trans={[0, 0.25]} className='absolute w-full flex flex-col items-center gap-2 mt-[50lvh]' distance={64} offset={-64}>
                            <Bullets range={[0, 0.25]} data={[
                                { text: 'TypeScript', logo: TS, href: 'https://www.typescriptlang.org/' },
                                { text: 'React', logo: ReactLogo, href: 'https://react.dev/' }
                            ]}
                                offset={0.6}
                            />
                            <Parallax trans={[0.25, 0]} distance={64} offset={-64} >
                                <Bullets range={[0, 0.25]} data={[
                                    { text: 'SQL', logo: SQLLogo, href: 'https://www.postgresql.org/' },
                                    { text: 'AWS', logo: AWSLogo, href: 'https://aws.amazon.com/de/console/' },
                                    { text: 'Node.js', logo: NodeJSLogo, href: 'https://nodejs.org/en' },
                                    { text: 'Vue.js', logo: VueJSLogo, href: 'https://vuejs.org/' },
                                    { text: 'Docker', logo: DockerLogo, href: 'https://www.docker.com/' },
                                    { text: 'Lambda', logo: LambdaLogo, href: 'https://aws.amazon.com/de/lambda/' },
                                ]}
                                    className="!flex-row"
                                    offset={0.75}
                                ></Bullets>
                            </Parallax>
                        </Parallax> */}

                    </SwiperSlide>

                </Swiper>
            </StickySection >

            <StickySection height='300lvh'>
                <DualImages images={[
                    "/images/wallpaper/4.webp",
                    "/images/wallpaper/6.webp",
                ]}
                    alts={[
                        'Waldweg beim Parkhotel, Fasanerie in Neustrelitz',
                        'Rosengarten beim Seepark in Freiburg'
                    ]}
                    invert desat />
                <AppearingText texts={['Looking for a senior TypeScript dev?', 'Looking for a lead developer?', 'Contact me']} slices={[0, 14, 0]} />
                <Parallax className='w-full mt-[25lvh] flex flex-col justify-center' distance={100} offset={-100}>
                    <Bullets data={[
                        { text: 'CV', logo: PDF, href: 'https://justmycv.com/en.pdf' },
                        { text: 'LinkedIn', logo: LI, href: 'https://www.linkedin.com/in/moritz-roessler-666b18175/' },
                    ]}
                        offset={0.75}
                    ></Bullets>
                    <Parallax distance={32} offset={-48}>

                        <Bullets data={[
                            {
                                text: 'GitHub',
                                logo: () => <GH style={{ fill: 'white' }} />,
                                href: 'https://github.com/C5H8NNaO4/javascript.moe'
                            },
                            {
                                text: 'SO',
                                logo: () => <StackOverflowLogo style={{ fill: 'white', width: 'unset' }} />,
                                href: 'https://satackoverflow.com/users/1487756/moritz-roessler'
                            }
                        ]}
                            reverse
                            offset={0.75}

                        // offset={0.55}
                        ></Bullets>
                    </Parallax>
                </Parallax>
            </StickySection>
        </>
    )
}

export const PerfumeLink = ({ range }: { range: number[] }) => {
    const { ref } = useContext(sectionCtx);

    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: ref || undefined,
        offset: ["start start", "end end"]
    });
    const trans = useTransform(scrollYProgress, range, [0, 1])


    return <Link to={'/' + i18n.language + '/perfumes'} className='underline text-[#EEEEEE]'><motion.h2 style={{ opacity: trans }}>Discover my perfumes</motion.h2></Link>
}