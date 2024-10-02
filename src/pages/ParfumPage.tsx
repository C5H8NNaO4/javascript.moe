import { drops2Grams, drops2ml, getGCD, getVH, toDrops } from "@/lib/util";
import { StickySection, sectionCtx } from "@/components/AnimatedSection";
import { BackgroundImage } from "@/components/BackgroundImage";
import { Parallax } from "@/components/anim/Parallax";
import { motion, useScroll, useTransform } from "framer-motion";
import ArrowBack from "@/assets/arrowback.svg?react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
} from "react";
import { AboutSectionProps } from "@/lib/types";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { EnsureLanguage } from "@/components/EnsureLanguage";
import {
  AllIngredients,
  Ingredient,
  OrangeForest,
  SylvanDawn,
  WoodenAmberHeart,
  WoodenHeart,
} from "@/assets/recipes";
import clsx from "clsx";
import { DualImages } from "@/components/BlendedImage";
import levenshtein from "fast-levenshtein";
import ReactDOM from "react-dom";

import {
  Line,
  ComposedChart,
  Bar,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
  Tooltip as RT,
  Legend,
  LabelList,
} from "recharts";
import { getCurrentBreakpoint } from "@/lib/hooks";

export const PerfumePage = () => {
  const { t } = useTranslation();
  const params = useParams();
  return (
    <div className="relative">
      {ReactDOM.createPortal(
        <>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/perfumes`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/perfumes`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/perfumes`}
          />
        </>,
        document.head
      )}
      <EnsureLanguage path="/perfumes" />
      <StickySection height="150lvh">
        <PerfumeText
          text={t("SylvanDawn")}
          title="Sylvan Dawn"
          bgSrc="/images/wallpaper/11.jpg"
          bgAlt="Depiction of my Sylvan Dawn Fragrance"
          imgSrc="/images/perfumes/SylvanDawn.jpg"
          imgAlt="Wooden Heart perfume depiction"
          ingredients={SylvanDawn}
        />
      </StickySection>
      <StickySection height="150lvh">
        <PerfumeText
          title="Wooden Heart"
          text={t("WoodenHeart")}
          bgSrc="/images/wallpaper/9.jpg"
          bgAlt="Waldweg"
          imgSrc="/images/perfumes/woodenheart.jpeg"
          imgAlt="Depiction of my Wooden Heart Fragrance"
          ingredients={WoodenHeart}
          variations={[
            {
              title: "Amber variation:",
              ingredients: WoodenAmberHeart,
            },
          ]}
        />
      </StickySection>
      <StickySection height="150lvh">
        <PerfumeText
          title="Orange Woods"
          text={t("OrangeWoods")}
          bgSrc="/images/wallpaper/orangewoodsbg.jpg"
          bgAlt="Depiction of my Orange Woods Fragrance in Landscape"
          imgSrc="/images/perfumes/orangewoods.jpg"
          imgAlt="Depiction of my Orange Woods Fragrance"
          ingredients={OrangeForest}
        />
      </StickySection>
    </div>
  );
};

export const IngredientPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [search, setSearch] = useState<string | null>(null);
  const [filter, setFilter] = useState({} as Record<string, boolean>);
  const [filterAnd, setConn] = useState(false);
  const toggle = (tag: string) => {
    setFilter({ ...filter, [tag]: !filter[tag] });
  };

  const filtered = [...new Set(AllIngredients.flatMap((i) => i.odour || []))]
    .sort((a, b) => {
      return a > b ? 1 : -1;
    })
    .filter((o) => {
      if (!filterAnd || !Object.keys(filter).some((o) => filter[o]))
        return true;
      return AllIngredients.some(
        (i) =>
          i.odour?.includes(o) &&
          Object.keys(filter).every((o) => i.odour?.includes(o))
      );
    })
    .map((o) => {
      return (
        <button
          onClick={() => toggle(o)}
          className={clsx(
            "p-2 rounded-xl bg-[#00000088] w-fit hover:text-black",
            {
              "bg-[green]": filter[o],
              "hover:bg-[#FFFFFF99]": !filter[o],
              "hover:bg-[#88F08899]": filter[o],
            }
          )}
        >
          {o}
        </button>
      );
    });

  return (
    <div className="relative">
      {ReactDOM.createPortal(
        <>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/ingredients`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/ingredients`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/ingredients`}
          />
        </>,
        document.head
      )}
      <EnsureLanguage path="/ingredients" />
      <div className="w-full p-2 absolute z-50 top-0 bg-[#00000055]">
        <input
          placeholder="Search..."
          type="text"
          className="w-full p-2 rounded-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* <StickySection height={"300vh"} > */}
      <div className="sticky top-0 absolute max-w-[100vw] flex">
        <DualImages
          images={[
            "/images/wallpaper/ingredients.jpg",
            "/images/wallpaper/ingredients-2.jpg",
          ]}
          alts={[]}
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-[64px] p-2 text-white">
        <button
          className="p-2 rounded-xl bg-[#FFF988DD] w-fit text-black"
          onClick={() => {
            setFilter({});
            setConn(!filterAnd);
          }}
        >
          {t(filterAnd ? "AND" : "OR")}
        </button>
        {filtered}
      </div>
      <Ingredients
        ingredients={AllIngredients}
        search={search}
        filter={filter}
        filterAnd={filterAnd}
      />
    </div>
  );
};

function CustomTooltip({
  payload,
  label,
  active,
}: {
  payload?: any[];
  label?: string;
  active?: boolean;
}) {
  if (active) {
    return (
      <div className="custom-tooltip bg-[#00000088] p-4">
        <b className=" text-white text-[24px] underline">{`${label}`}</b>
        {payload?.map((p) => {
          return (
            <p className="label">{`${labels[p.name as "RER"]}: ${p.value}`}</p>
          );
        })}
      </div>
    );
  }

  return null;
}

const labels = {
  RER: "Evaporation:",
  PPT: "Content (ppt)",
  "Relative Impact": "Impact",
};
export const Spectogram = ({ data }: { data: any }) => {
  const bp = getCurrentBreakpoint();
  const bps = [bp === "3xs", bp === "2xs", bp === "xs"];
  const isMobile = bps.some(Boolean);
  return (
    <div className="mt-8">
      <ResponsiveContainer width={"100%"} height={400}>
        <ComposedChart data={data} margin={{ bottom: 100, left: -24 }}>
          <Legend align="center" verticalAlign="top" />
          <CartesianGrid stroke="#f5f5f5" fill="#FFFFFF88" />
          <XAxis
            dataKey="name"
            textAnchor="start"
            height={60}
            angle={45}
            interval={bps[0] ? 5 : bps[1] ? 3 : bps[2] ? 1 : 0}
            dx={0}
            dy={8}
            minTickGap={16}
            color="white"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "darkred" }}
            // axisLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
            axisLine={{
              fill: "green",
              stroke: "green",
              filter: "drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4))",
            }}
          />
          <YAxis
            yAxisId="left-2"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
            axisLine={{
              fill: "orange",
              stroke: "orange",
              filter: "drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4))",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
            axisLine={{ fill: "darkred", stroke: "darkred" }}
          />

          <Bar
            name="PPT"
            yAxisId="left"
            dataKey="ppt"
            barSize={10}
            fill="green"
          >
            {!isMobile && (
              <LabelList
                dataKey="ppt"
                position="bottom"
                angle={270}
                offset={-32}
                dx={-4.5}
                fontSize={"11px"}
                fill="white"
                formatter={(v: string) => v + "‰"}
              />
            )}
          </Bar>
          <Bar
            name="Relative Impact"
            yAxisId="left-2"
            dataKey="impact"
            barSize={10}
            fill="orange"
          />
          <Line
            name="RER"
            yAxisId={"right"}
            type="monotone"
            dataKey="er"
            stroke="#8b0000AA"
          />
          <RT content={(props) => <CustomTooltip {...props} />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
export const PerfumeText = ({
  ingredients,
  variations = [],
  title,
  bgSrc,
  bgAlt,
  imgAlt,
  imgSrc,
}: AboutSectionProps) => {
  const { ref: scrollRef } = useContext(sectionCtx);
  const innerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: scrollRef || undefined,
    offset: ["start start", "end end"],
  });

  // const { scrollYProgress: scrollInner } = useScroll({
  //     layoutEffect: false,
  //     container: innerRef || undefined,
  //     offset: ["start start", "end end"]
  // });

  const dist = getVH(50);
  const offset = -dist;
  // const blur = useTransform(scrollYProgress, [0, 0.75], ['blur(4px)', 'blur(0px)'])
  const rblur = useTransform(
    scrollYProgress,
    [0, 0.75],
    [
      "brightness(100%) blur(0px) saturate(100%)",
      "brightness(80%) blur(4px) saturate(140%)",
    ]
  );
  const background = useTransform(
    scrollYProgress,
    [0, 0.75],
    ["#FFFFFF11", "#00000033"]
  );
  // const overflowY = useTransform(scrollYProgress, [0, 0.75], ['hidden', 'auto']);
  const bi = useTransform(scrollYProgress, [0, 0.75], ["1000px", "4px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], ["20%", "100%"]);

  const anchors = ["sylvan dawn", "wooden heart", "orange woods"];

  const [sort, setSort] = useState(1);
  const { t } = useTranslation();
  useEffect(() => {
    const index = anchors.indexOf(
      decodeURIComponent(window.location.hash.slice(1).toLowerCase())
    );
    const pos = index * 2;

    if (index > -1) {
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * pos });
      }, 250);
    }
  });

  return (
    <>
      <BackgroundImage src={bgSrc} alt={bgAlt} />
      <div className="w-[84ch] max-w-[calc(100vw-32px)] absolute top-0">
        <Parallax
          distance={32 * 2}
          offset={32 * 1}
          className="flex"
          trans={[0.75, 0]}
        >
          <Link to={`/${i18n.language}`} className="flex">
            <ArrowBack style={{ fill: "white" }} />
            <h2>{t("Back")}</h2>
          </Link>
        </Parallax>
        <Parallax
          distance={dist + 32 * 2}
          offset={offset - 32 * 4}
          trans={[0.75, 0]}
          className=""
        >
          <button
          // onClick={scrollToTop}
          >
            <motion.div
              style={{
                background,
                backdropFilter: rblur,
              }}
              className="flex flex-col  overflow-y-scroll max-h-[calc(100svh-120px)] rounded-md shadow-lg shadow-black  text-left"
            >
              <motion.div
                ref={innerRef}
                className="relative flex flex-col sm:flex-row  gap-4 p-4 "
              >
                {/* <motion.div style={{ display: 'block' }} /> */}

                <motion.img
                  alt={imgAlt}
                  style={{ x: 0, borderRadius: bi, opacity }}
                  className=" top-4 w-full sm:w-1/3 h-fit object-cover pr-4"
                  src={imgSrc}
                />
                <div className=" w-full">
                  {/* <motion.p className="text-left px-4  whitespace-pre-line " style={{ filter: blur, textShadow: '1px 1px 1px black' }}>{text}</motion.p> */}

                  <div>
                    <Recipe ingredients={ingredients || []} />
                    {variations.map((v) => {
                      return (
                        <>
                          <p className="mt-2">{v.title}</p>
                          <Recipe ingredients={v.ingredients}></Recipe>
                        </>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
              <div className="flex gap-1 ml-4">
                <label>Sort:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(Number(e.target.value))}
                >
                  <option value={0}>RER</option>
                  <option value={1}>Amount</option>
                  <option value={2}>Impact</option>
                </select>
              </div>
              <Spectogram
                data={ingredients
                  ?.filter((i) => i.dilutant !== true)
                  ?.sort((a, b) => {
                    const aU = toDrops(a.amount) * ((a.dilution || 100) / 100);
                    const bU = toDrops(b.amount) * ((b.dilution || 100) / 100);
                    if (sort === 0)
                      return a.evaporationRate - b.evaporationRate;
                    if (sort === 1) return bU - aU;
                    if (sort === 2)
                      return (
                        bU * (b.relativeStrength || 1) -
                        aU * (a.relativeStrength || 1)
                      );
                    return a.evaporationRate - b.evaporationRate;
                  })
                  .map((i, _, arr) => {
                    const undiluted =
                      toDrops(i.amount) / (100 / (i.dilution || 100));
                    const totalU = arr.reduce((acc, i) => {
                      const undiluted =
                        toDrops(i.amount) / (100 / (i.dilution || 100));
                      return acc + undiluted;
                    }, 0);

                    const totalImp = arr.reduce((acc, i) => {
                      const undiluted =
                        (toDrops(i.amount) / (100 / (i.dilution || 100))) *
                        (i.relativeStrength || 1);
                      return acc + undiluted;
                    }, 0);

                    const prc = (100 / totalU) * undiluted;
                    const prcI = (100 / totalImp) * undiluted;
                    const impact = prcI * (i.relativeStrength || 1);

                    return {
                      er: i.evaporationRate,
                      ppt: ~~(prc * 10000) / 1000,
                      impact: ~~(impact * 100) / 10,
                      name: i.name,
                    };
                  })}
              />
            </motion.div>
          </button>
        </Parallax>
        <Parallax
          distance={dist - 32 * 2}
          offset={offset + 32}
          className="w-fit absolute top-0 ml-4"
          trans={[0.75, 0]}
        >
          <button
            className="w-fit"
            // onClick={scrollToTop}
          >
            <h1 style={{ textShadow: "0px 0px 3px black" }}>{title}</h1>
          </button>
        </Parallax>
      </div>
    </>
  );
};

export const Ingredients = ({
  ingredients,
  search,
  filter,
  filterAnd,
}: {
  ingredients?: Ingredient[];
  search: null | string;
  filter: Record<string, boolean>;
  filterAnd?: boolean;
}) => {
  const { ref: scrollRef } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: scrollRef || undefined,
    offset: ["start start", "end end"],
  });
  //   const y = useParallax(scrollYProgress, 64, -64);
  const rblur = useTransform(
    scrollYProgress,
    [0, 0.75],
    [
      "brightness(80%) blur(4px) saturate(100%)",
      "brightness(80%) blur(4px) saturate(110%)",
    ]
  );
  const filtered = ingredients
    ?.filter((ing) => {
      if (!Object.keys(filter).some((k) => filter[k])) return true;
      if (filterAnd) {
        return Object.keys(filter)
          .filter((k) => filter[k])
          .reduce((acc, k) => {
            return (acc && ing.odour?.includes(k)) as boolean;
          }, true);
      }
      return (ing.odour || []).some((o) => filter[o]);
    })
    .filter((ing) => {
      if (!search) return true;

      let dist = 1000;
      for (let i = 0; i < ing.name.length; i++) {
        const d = levenshtein.get(
          ing.name.toLowerCase().slice(i, search.length + i),
          (search || "").toLowerCase()
        );
        if (d <= dist) dist = d;
      }

      return dist <= 2;
    });

  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 w-[100vw] lg:w-[66vw] mx-auto pt-2">
      <span className="p-2 bg-[#FFFFFF99] rounded-sm">
        {filtered?.length} {t("ingredients")}
      </span>

      {filtered?.map((ing) => {
        return (
          <motion.div
            className="p-4 bg-[#00000044]"
            style={{
              // y,
              textShadow: "1px 1px 3px black",
              backdropFilter: rblur,
            }}
          >
            <div className="flex flex-col gap-4 flex-wrap ">
              <div className="flex flex-row flex-grow whitespace-nowrap gap-4 flex-wrap ">
                <h2 className="w-full">
                  {ing.name} {ing.company ? " by " + ing.company : ""}
                </h2>
                <p>
                  <b>Start with: </b> {ing.amount}
                </p>
                <p>
                  <b>Dilution: </b>
                  {ing.dilution ? ing.dilution + "%" : " Don't dilute"}
                </p>
                <p>
                  <b>Strength: </b>
                  {ing.relativeStrength ? "x" + ing.relativeStrength : "x1"}
                </p>
                <p>
                  <b>RER: </b>
                  {ing.evaporationRate ? ing.evaporationRate + "min" : "-"}
                </p>
              </div>
              <div className="flex-shrink w-fit whitespace-pre-line">
                <p>{ing.exp.desc}</p>
              </div>
            </div>
            ;
          </motion.div>
        );
      })}
    </div>
  );
};
export type Explanation = {
  vol?: string;
  desc?: string;
  dil?: string;
  com?: string;
};

export const Recipe = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const [visible, setVisible] = useState<string | null>(null);
  const [part, setPart] = useState<keyof Explanation | null>(null);
  const [params] = useSearchParams();
  const to = useRef(0);
  const hide = () => {
    clearTimeout(to.current);
    to.current = setTimeout(() => {
      setPart(null);
    }, 250);
  };
  const Show = (part: keyof Explanation, show: boolean = true) => {
    return () => {
      clearTimeout(to.current);
      if (show && part) {
        setPart(part);
      } else setVisible(null);
    };
  };

  const [unit, setUnit] = useState(Number(params.get("unit") || 0));

  const denomDrops = getGCD(
    ingredients.map((i) => {
      const drops = toDrops(i.amount);
      return drops;
    })
  );
  const denomGrams =
    getGCD(
      ingredients.map((i) => {
        const drops = drops2Grams(toDrops(i.amount)) * 100;
        return drops;
      })
    ) / 100;
  const denomMl =
    getGCD(
      ingredients.map((i) => {
        const drops = drops2ml(toDrops(i.amount)) * 10;
        return drops;
      })
    ) / 10;
  const totalDrops = ingredients
    .filter((i) => !i.dilutant)
    .reduce((acc, i) => {
      const diluted = toDrops(i.amount);
      const undiluted = diluted / (100 / (i.dilution || 100));
      return acc + (unit === 0 ? diluted : undiluted);
    }, 0);

  const total =
    unit === 0
      ? totalDrops + "dr"
      : unit === 1
      ? (drops2Grams(totalDrops) / denomGrams).toFixed(2) + "g"
      : unit === 2
      ? "100%"
      : unit === 3
      ? (drops2ml(totalDrops) / denomMl).toFixed(2) + "ml"
      : "";
  return (
    <div>
      <div className="flex flex-row gap-2">
        <select onChange={(e) => setUnit(Number(e.target.value))} value={unit}>
          <option value={0}>Drops</option>
          <option value={1}>Grams</option>
          <option value={2}>Percentage</option>
          <option value={3}>ML</option>
        </select>
        <b className="text-white">{total}</b>
      </div>
      {ingredients.map((ing) => {
        const { amount, dilution, name, company, exp } = ing;
        const showTooltip = visible === name && !!part;

        const drops = toDrops(amount) / denomDrops;
        const grams = (
          (drops2Grams(toDrops(amount)) / denomGrams) *
          ((dilution || 100) / 100)
        ).toFixed(3);
        const ml = (
          (drops2ml(toDrops(amount)) / denomMl) *
          ((dilution || 100) / 100)
        ).toFixed(3);
        const totalU = ingredients
          .filter((i) => !i.dilutant)
          .reduce((acc, i) => {
            const undiluted = toDrops(i.amount) / (100 / (i.dilution || 100));
            return acc + undiluted;
          }, 0);
        const prc = ing.dilutant
          ? null
          : ((100 / totalU) * toDrops(amount)).toFixed(2);
        return (
          <div
            onMouseOver={() => setVisible(name)}
            onMouseLeave={() => setVisible(null)}
          >
            <p>
              <span>{"- "}</span>
              <span
                onTouchEnd={showTooltip ? hide : Show("vol")}
                style={{
                  textDecoration: exp.vol ? "underline dotted 0.5px" : "",
                }}
                onMouseEnter={Show("vol", !!exp.vol && exp.vol !== amount)}
                onMouseLeave={hide}
              >
                {unit === 0
                  ? drops + "dr"
                  : unit === 1
                  ? grams + "g"
                  : unit === 3
                  ? ml + "ml"
                  : prc
                  ? prc + "%"
                  : ""}{" "}
              </span>
              <span
                onTouchEnd={showTooltip ? hide : Show("desc")}
                style={{
                  textDecoration: exp.desc ? "underline dotted 0.5px" : "",
                }}
                onMouseEnter={Show("desc")}
                onMouseLeave={hide}
              >
                {name}{" "}
              </span>
              {dilution !== null && unit < 1 && (
                <span
                  onTouchEnd={showTooltip ? hide : Show("dil")}
                  style={{
                    textDecoration: exp.dil ? "underline dotted 0.5px" : "",
                  }}
                  onMouseEnter={Show("dil", !!exp.dil)}
                  onMouseLeave={hide}
                >
                  {dilution}%{" "}
                </span>
              )}
              {company && (
                <span
                  onTouchEnd={showTooltip ? hide : Show("com")}
                  style={{
                    textDecoration: exp.com ? "underline dotted 0.5px" : "",
                  }}
                  onMouseEnter={Show("com")}
                  onMouseLeave={hide}
                >
                  {" "}
                  by {company}{" "}
                </span>
              )}
            </p>
            <Tooltip
              visible={showTooltip}
              onMouseEnter={() => {
                clearTimeout(to.current);
              }}
              onMouseLeave={hide}
            >
              {part && exp[part]}
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};
export type TooltipProps = PropsWithChildren<{
  visible: boolean;
  onMouseEnter?: any;
  onMouseLeave?: any;
}>;

export const Tooltip = ({ children, visible, ...rest }: TooltipProps) => {
  // if (!visible) return null;
  const { ref } = useContext(sectionCtx);
  const { scrollYProgress } = useScroll({
    layoutEffect: false,
    target: ref || undefined,
    offset: ["start start", "end end"],
  });

  const bp = getCurrentBreakpoint();
  const isMobile = [bp === "2xs", bp === "xs"].some(Boolean);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["calc(0lvh + 32px)", "calc(50lvh + 32px)"] : ["0lvh", "50lvh"]
  );
  return ReactDOM.createPortal(
    <motion.div
      style={{ y }}
      className={clsx(
        "overflow-y-scroll whitespace-pre-line absolute z-[1000] max-h-[40vh] sm:max-h-[100lvh] sm:h-[100lvh] w-[100vw] sm:w-[22vw] top-4 sm:top-0 right-0 transition-opacity  bg-[black] p-4 text-white",
        {
          "pointer-events-none": !visible,
          "opacity-100": visible,
          "opacity-0": !visible,
          "h-0": !visible,
        }
      )}
      {...rest}
    >
      {children}
    </motion.div>,
    ref?.current || document.body
  );
};
