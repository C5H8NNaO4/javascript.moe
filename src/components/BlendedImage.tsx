import { easeOut, useScroll, useTransform } from "framer-motion";
import { useContext, useEffect, useRef } from "react"
import { sectionCtx } from "@/components/AnimatedSection";
import { useParallax } from "@/lib/hooks";
import { motion } from 'framer-motion';
import clsx from 'clsx';

function blend(bottomImageData: ImageData, topImageData: ImageData, alpha: number) {
    var bottomData = bottomImageData.data;
    var topData = topImageData.data;

    for (var i = 0; i < topData.length; i += 4) {
        topData[i] = Math.sqrt(Math.pow((alpha) * topData[i], 2) + Math.pow((1 - alpha) * bottomData[i], 2))
        topData[i + 1] = Math.sqrt(Math.pow((alpha) * topData[i + 1], 2) + Math.pow((1 - alpha) * bottomData[i + 1], 2))
        topData[i + 2] = Math.sqrt(Math.pow((alpha) * topData[i + 2], 2) + Math.pow((1 - alpha) * bottomData[i + 2], 2))

    }

    return topData
}

export const BlendedImage = ({ images, invert, desat }: { images: string[], invert?: boolean, desat?: boolean }) => {
    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!ref.current) {

        }
    }, [ref.current]);

    const imgARef = useRef<HTMLImageElement>(null);
    const imgBRef = useRef<HTMLImageElement>(null);

    const { ref: scrollRef } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: scrollRef || undefined,
        offset: ["start start", "end end"]
    });


    const height = screen.height * 1.4;
    const y = useParallax(scrollYProgress, 50, 0)

    const imgFilter = useTransform(scrollYProgress, invert ? [1, 0.75] : [0, 0.25], ["saturate(0%) blur(12px)", "saturate(100%) blur(0px)"]);

    const animate = function () {
        if (!imgARef.current || !imgBRef.current) return;
        const offset = 1 + Math.floor((images.length - 1) * scrollYProgress.get());
        const a = images[offset - 1];
        const b = images[offset];
        const progress = (scrollYProgress.get() * (images.length - 1)) % 1;

        // requestAnimationFrame(animate);
        if (!imgARef.current.src.includes(a)) {
            imgARef.current.src = a;
            imgBRef.current.src = b;
            return;
        }

        const canvas = ref.current;

        const imgA = imgARef.current;
        const imgB = imgBRef.current;

        if (imgA.naturalWidth === 0) return
        if (imgB.naturalWidth === 0) return


        var hRatio = (canvas?.width || window.innerWidth) / (imgA.width || window.innerWidth);
        var vRatio = height / imgB.height;
        var ratio = Math.max(hRatio, vRatio);

        ref?.current?.getContext('2d')?.drawImage(imgA, 0, 0, imgA.width, imgA.height, 0, 0, imgA.width * ratio, imgA.height * ratio);

        const pixelsA = ref.current?.getContext('2d')?.getImageData(0, 0, window.innerWidth, height) || new ImageData(0, 0);
        ref?.current?.getContext('2d')?.drawImage(imgB, 0, 0, imgB.width, imgB.height, 0, 0, imgB.width * ratio, imgB.height * ratio);


        const pixelsB = ref.current?.getContext('2d')?.getImageData(0, 0, window.innerWidth, height) || new ImageData(0, 0);

        const pixelsC = blend(pixelsA, pixelsB, progress);
        const imgData = new ImageData(window.innerWidth, height);
        imgData.data.set(pixelsC);
        ref?.current?.getContext('2d')?.putImageData(imgData, 0, 0);
    }

    useEffect(() => {
        scrollYProgress.on('change', animate);
    }, []);

    return <>
        <img ref={imgARef} src={images[0]} style={{ display: 'none' }} />
        <img ref={imgBRef} src={images[1]} onLoad={animate} style={{ display: 'none' }} />
        <motion.canvas ref={ref} width={window.innerWidth} height={height} style={{ y, filter: desat ? imgFilter : undefined }} />
    </>
}

export const DualImages = ({
    className,
    range = [0, 1],
    images,
    moveX = 0,
    xMotion = [[0, 1], ["0% 00%", "50% 0%"]],
    x2Motion = [[0.5, 0.9, 1], ["8% 0%", "42% 0%", "25% 0%"]],
    alts,
    active
}: {
    xMotion?: [number[], any[]],
    x2Motion?: [number[], any[]],
    className?: string; range?: number[], images: string[], alts: string[], invert?: boolean, desat?: boolean,
    moveX?: 0 | 1 | 2 | 3
    active?: boolean
}) => {
    const { ref: scrollRef } = useContext(sectionCtx);
    const { scrollYProgress } = useScroll({
        layoutEffect: false,
        target: scrollRef || undefined,
        offset: ["start start", "end end"]
    });
    const trans = useTransform(scrollYProgress, range, [0, 1])

    const y = useParallax(trans, 50, 0)
    const x = useTransform(trans, ...xMotion);
    const x2 = useTransform(trans, ...x2Motion);
    const filter = useTransform(trans, [0.9, 1], ["blur(0px)", "blur(12px)"], { ease: easeOut })
    const scale = useTransform(trans, [0.9, 1], ["100%", "104%"])
    const y2 = useParallax(trans, 75, -25);
    const down = useTransform(trans, [0.9, 1], [0, 10]);
    const y2C = useTransform(() => y2.get() + (down.get() * 2))
    const reverse = useTransform(trans, [0, 1], [1, 0]);

    return <motion.div className={clsx(className, "absolute w-[100vw] h-[120vh] h-[120lvh] bg-black")} style={{ filter }}>
        <motion.img src={images[0]} alt={alts[0]} className="absolute w-[100vw] h-[120vh] h-[120lvh]" style={{
            opacity: reverse,
            objectPosition: (moveX & 1) ? x : undefined,
            scale: active ? scale : undefined,
            y: y
        }} />
        <motion.img src={images[1]} alt={alts[1]} className="absolute w-[100vw] h-[120vh] h-[120lvh]" style={{
            opacity: trans,
            objectPosition: (moveX & 2) ? x2 : undefined,
            scale: active ? scale : undefined,
            y: y2C,
        }} />
    </motion.div>
}