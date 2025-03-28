/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  drops2Grams,
  drops2ml,
  getGCD,
  getVH,
  lngLnk,
  round,
  toDrops,
} from "@/lib/util";
import ArrowRight from "@/assets/arrowright.svg?react";
import Cross from "@/assets/cross.svg?react";
import { StickySection, sectionCtx } from "@/components/AnimatedSection";
import { BackgroundImage, FadingImage } from "@/components/BackgroundImage";
import { Parallax } from "@/components/anim/Parallax";
import { motion, useScroll, useTransform } from "framer-motion";
import ArrowBack from "@/assets/arrowback.svg?react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from "rctx-contextmenu";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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

import { IngredientDetail, InventoryList } from "../components/Inventory";

import { inventory } from "@/static/inventory";
import { perfumersApprenticeInventory } from "@/static/data/ingredients/perfumersApprentice";
import { isSmallerEq, useCurrentBreakpoint } from "@/hooks/useBreakpoint";
import {
  FormulaIngredientProps,
  FragrancePlanner,
} from "@/components/FragrancePlanner";
import { FormulaPublisher } from "@/components/FormulaPublisher";
import { Formula, FormulaCards, FormulaList } from "@/components/FormulaList";
import { useListFormulasQuery } from "@/apollo/queries/generated/graphql";
import { ActionInput } from "@/components/Input";
import { IdentifyOverlay } from "@/components/IdentifyOverlay";
import { IdentifyItem } from "@/components/Items";

const Images: Record<string, string[]> = {
  "Vetiveryl Acetat": [
    "/images/ingredients/vetiveryl-acetat-1.jpg",
    "/images/ingredients/vetiveryl-acetat-2.jpg",
    "/images/ingredients/vetiveryl-acetat-3.jpg",
    "/images/ingredients/vetiveryl-acetat-4.jpg",
    "/images/ingredients/vetiveryl-acetat-5.jpg",
  ],
};
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
      <StickySection height="150vh">
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
      <StickySection height="150vh">
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
      <StickySection height="150vh">
        <PerfumeText
          title="Orange Woods"
          text={t("OrangeWoods")}
          bgSrc={{
            sm: [
              "/images/wallpaper/orangewoodsbg.jpg",
              "/images/wallpaper/orangewoodsbg-1.jpg",
              "/images/wallpaper/orangewoodsbg-2.jpg",
              "/images/wallpaper/orangewoodsbg-3.jpg",
              "/images/wallpaper/orangewoodsbg-4.jpg",
              "/images/wallpaper/orangewoodsbg-5.jpg",
              "/images/wallpaper/orangewoodsbg-6.jpg",
              "/images/wallpaper/orangewoodsbg-7.jpg",
            ],
            // xs: "/images/wallpaper/orangewoodsbg9x16.jpg",
            // "2xs": "/images/wallpaper/orangewoodsbg9x16.jpg",
            "3xs": [
              "/images/wallpaper/orangewoodsbg9x16.jpg",
              "/images/wallpaper/orangewoodsbg9x16-1.jpg",
              "/images/wallpaper/orangewoodsbg9x16-2.jpg",
              "/images/wallpaper/orangewoodsbg9x16-3.jpg",
              "/images/wallpaper/orangewoodsbg9x16-4.jpg",
              "/images/wallpaper/orangewoodsbg9x16-5.jpg",
              "/images/wallpaper/orangewoodsbg9x16-6.jpg",
              "/images/wallpaper/orangewoodsbg9x16-7.jpg",
            ],
          }}
          bgAlt="Depiction of my Orange Woods Fragrance in Landscape"
          imgSrc={[
            "/images/perfumes/orangewoods.jpg",
            "/images/perfumes/orangewoods-1.jpg",
            "/images/perfumes/orangewoods-2.jpg",
            "/images/perfumes/orangewoods-3.jpg",
            "/images/perfumes/orangewoods-4.jpg",
            "/images/perfumes/orangewoods-5.jpg",
            "/images/perfumes/orangewoods-6.jpg",
            "/images/perfumes/orangewoods-7.jpg",
          ]}
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

export const InventoryPage = () => {
  const params = useParams();
  return (
    <div className="h-full w-full relative flex justify-center page">
      {ReactDOM.createPortal(
        <>
          <div></div>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/inventory`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/inventory`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/inventory`}
          />

          <link
            rel="icon"
            type="image/png"
            href="/icons/inventory/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/icons/inventory/favicon.svg"
          />
          <link rel="shortcut icon" href="/icons/inventory/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/inventory/apple-touch-icon.png"
          />
          <link rel="manifest" href="/icons/inventory/site.webmanifest" />
          <meta
            name="description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:title"
            content="Perfumery Ingredients Inventory"
            data-react-helmet="true"
          />
          <meta
            property="og:description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:image"
            content="https://javascript.moe/images/inventory.png"
          />
          <meta
            property="og:url"
            content="https://javascript.moe/en/inventory"
          />
          <title>Perfumery Ingredients | Inventory Web App</title>
        </>,
        document.head
      )}
      <EnsureLanguage path="/inventory" />

      <div className="absolute top-0  max-w-[100vw] flex h-fit w-full">
        <img src="/images/wallpaper/ingredients.jpg" className="w-full" />
      </div>
      <div className="flex flex-col gap-4 w-[100vw]  mx-auto p-1 lg:p-4 bg-black/80 text-white">
        <div className="backdrop-blur-sm h-full w-full flex flex-col">
          <InventoryList
            inventories={{
              remote: {
                All: perfumersApprenticeInventory,
                Moe: inventory || [],
              },
              local: {
                Local: [],
              },
            }}
          ></InventoryList>
        </div>
      </div>
    </div>
  );
};

export const FragrancePage = () => {
  const params = useParams();

  return (
    <div className="h-full w-full relative flex justify-center page">
      {ReactDOM.createPortal(
        <>
          <div></div>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/formula/compose`}
          />

          <link
            rel="icon"
            type="image/png"
            href="/icons/inventory/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/icons/inventory/favicon.svg"
          />
          <link rel="shortcut icon" href="/icons/inventory/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/inventory/apple-touch-icon.png"
          />
          <link rel="manifest" href="/icons/inventory/site.webmanifest" />
          <meta
            name="description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:title"
            content="Perfumery Ingredients Inventory"
            data-react-helmet="true"
          />
          <meta
            property="og:description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:image"
            content="https://javascript.moe/images/inventory.png"
          />
          <meta
            property="og:url"
            content="https://javascript.moe/en/inventory"
          />
          <title>Perfumery Ingredients | Formula Builder</title>
        </>,
        document.head
      )}
      <EnsureLanguage path="/formula/compose" />

      <div className="absolute top-0  max-w-[100vw] flex h-full w-full">
        <img src="/images/wallpaper/ingredients.jpg" className="w-full" />
      </div>
      <div className="flex flex-col gap-4 w-[100vw]  mx-auto p-1 lg:p-4 bg-black/80 text-white h-full ">
        <div className="backdrop-blur-sm h-screen w-full flex flex-col overflow-y-hidden">
          <FragrancePlanner
            inventories={{
              remote: {
                All: perfumersApprenticeInventory,
                Moe: inventory || [],
              },
              local: {
                Local: [],
              },
            }}
          ></FragrancePlanner>
        </div>
      </div>
    </div>
  );
};

export const FormulaPage = () => {
  const params = useParams();
  const { data } = useListFormulasQuery();
  const formulas = data?.listFormulas;

  const { title: paramsTitle, author } = params;
  const selected = formulas?.find(
    (itm) =>
      itm?.title === paramsTitle && (itm?.author === author || author === "*")
  );

  const { hash } = useLocation();
  const selectedItems = selected?.items || [];
  const selectedItem = selectedItems?.find(
    (itm) => itm?.title === decodeURIComponent(hash.slice(1))
  );
  console.log("SELECTED ITM", selectedItem);
  const navigate = useNavigate();

  const bp = useCurrentBreakpoint();
  const isMobile = isSmallerEq(bp, "sm");

  const [expanded, setExpanded] = useState(!isMobile);
  const [showIdentifyOverlay, setShowIdentifyOverlay] = useState(false);

  const [searchParams] = useSearchParams();
  const library = searchParams.get("library");
  const isRemote = searchParams.get("remote");

  return (
    <div className="h-full w-full relative flex justify-center page p-4">
      {ReactDOM.createPortal(
        <>
          <div></div>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/formula/compose`}
          />

          <link
            rel="icon"
            type="image/png"
            href="/icons/inventory/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/icons/inventory/favicon.svg"
          />
          <link rel="shortcut icon" href="/icons/inventory/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/inventory/apple-touch-icon.png"
          />
          <link rel="manifest" href="/icons/inventory/site.webmanifest" />
          <meta
            name="description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:title"
            content="Perfumery Ingredients Inventory"
            data-react-helmet="true"
          />
          <meta
            property="og:description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:image"
            content="https://javascript.moe/images/inventory.png"
          />
          <meta
            property="og:url"
            content="https://javascript.moe/en/inventory"
          />
          <title>Perfumery Ingredients | Fragrance Composer</title>
        </>,
        document.head
      )}
      <EnsureLanguage path="/formula/compose" />

      <div className="absolute top-0  max-w-[100vw] flex h-fit w-full">
        <img
          src="/images/wallpaper/ingredients.jpg"
          className="w-full saturate-0"
        />
      </div>
      <div className="flex flex-col absolute z-0 w-full px-4 h-full">
        <ActionInput placeholder="Search..."></ActionInput>
        <FormulaCards
          search=""
          onSelect={(frmla: any) => {
            navigate(
              lngLnk`/formula/${frmla.author || "*"}/${frmla.title}/?library=${
                library || "Local"
              }&${isRemote ? "&remote=1" : ""}`
            );
            setExpanded(true);
          }}
          inventories={{
            remote: { All: perfumersApprenticeInventory, Moe: inventory },
            local: {},
          }}
        ></FormulaCards>
      </div>
      <div
        className={clsx("recent overlay h-full", {
          expanded: isMobile || expanded,
        })}
      >
        <ContextMenuTrigger id="my-context-menu-1" className="h-full">
          <div className="blackoverlay flex flex-col gap-4 w-[100vw]  mx-auto lg:p-4 bg-black/80 text-white h-full ">
            <div className="formulacontainer backdrop-blur-sm h-full overflow-hidden w-full flex gap-1 relative">
              <FormulaList
                inventories={{
                  remote: {
                    All: perfumersApprenticeInventory,
                    Moe: inventory || [],
                  },
                  local: {
                    Local: [],
                  },
                }}
                onSelect={(frmla: any) => {
                  navigate(
                    lngLnk`/formula/${frmla.author || "*"}/${frmla.title}/`
                  );
                }}
              ></FormulaList>
              {selected && (
                <Formula
                  formula={selected}
                  inventories={{
                    remote: {
                      All: perfumersApprenticeInventory,
                      Moe: inventory || [],
                    },
                    local: {
                      Local: [],
                    },
                  }}
                  onSelect={(ing: FormulaIngredientProps) => {
                    navigate(window.location.search + "#" + ing.title);
                  }}
                  selected={selectedItem}
                  onToggle={() => {
                    setExpanded(!expanded);
                    if (!isMobile)
                      setTimeout(() => {
                        navigate(lngLnk`/formulas/`);
                      }, 1000);
                  }}
                  expanded={expanded}
                ></Formula>
              )}
              {selectedItem && (
                <IngredientDetail
                  inventories={{
                    remote: {
                      All: perfumersApprenticeInventory,
                      Moe: inventory,
                    },
                    local: {},
                  }}
                  selected={selectedItem as any}
                  setSelected={(sel) => {
                    navigate(window.location.search + "#" + (sel?.title || ""));
                    if (isMobile) setExpanded(false);
                  }}
                  invRemote={isRemote ? library || "Moe" : ""}
                  invLocal={!isRemote ? library || "Local" : ""}
                  list={selected?.items || ([] as any)}
                  sorted={selected?.items || ([] as any)}
                  upd={() => {}}
                  expanded={expanded}
                ></IngredientDetail>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenu id="my-context-menu-1" appendTo="body">
          <ContextMenuItem
            className="group"
            onClick={() => {
              setShowIdentifyOverlay(true);
            }}
          >
            <IdentifyItem></IdentifyItem>
          </ContextMenuItem>
          <ContextMenuItem>Menu Item 2</ContextMenuItem>
          <ContextMenuItem>Menu Item 3</ContextMenuItem>
          <ContextMenuItem>Menu Item 4</ContextMenuItem>
        </ContextMenu>
        <IdentifyOverlay
          open={showIdentifyOverlay}
          onClose={() => {
            setShowIdentifyOverlay(false);
          }}
        ></IdentifyOverlay>
      </div>
    </div>
  );
};

export const DiscoverPage = () => {
  const params = useParams();

  const navigate = useNavigate();

  const [, setExpanded] = useState(true);
  const [search, setSearch] = useState("");

  const bp = useCurrentBreakpoint();
  const isMobile = isSmallerEq(bp, "sm");
  const [searchParams] = useSearchParams();
  const library = searchParams.get("library") || "Local";
  const isRemote = !!searchParams.get("remote");

  return (
    <div className="h-full w-full relative flex justify-center page">
      {ReactDOM.createPortal(
        <>
          <div></div>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/formula/compose`}
          />

          <link
            rel="icon"
            type="image/png"
            href="/icons/inventory/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/icons/inventory/favicon.svg"
          />
          <link rel="shortcut icon" href="/icons/inventory/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/inventory/apple-touch-icon.png"
          />
          <link rel="manifest" href="/icons/inventory/site.webmanifest" />
          <meta
            name="description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:title"
            content="Perfumery Ingredients Inventory"
            data-react-helmet="true"
          />
          <meta
            property="og:description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:image"
            content="https://javascript.moe/images/inventory.png"
          />
          <meta
            property="og:url"
            content="https://javascript.moe/en/inventory"
          />
          <title>Perfumery Ingredients | Formula Builder</title>
        </>,
        document.head
      )}
      <EnsureLanguage path="/formula/compose" />

      <div className="absolute top-0  max-w-[100vw] flex h-fit w-full">
        <img src="/images/wallpaper/ingredients.jpg" className="w-full h-screen" />
      </div>

      <ContextMenuTrigger id="my-context-menu-1" className="h-fit w-full">
        <div className="m-4 flex flex-col h-full">
          <ActionInput
            placeholder="Search..."
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
            icon="FaPlus"
            onSubmit={() => {
              navigate(lngLnk`/formula/compose`);
            }}
            actionTooltip="Compose New Formula"
          ></ActionInput>
          <FormulaCards
            onSelect={(frmla: any) => {
              if (frmla.title)
                navigate(
                  lngLnk`/formula/${frmla.author || "*"}/${
                    frmla.title
                  }/?library=${library}${isRemote ? "&remote=1" : ""}`
                );
              setExpanded(!isMobile);
            }}
            inventories={{
              remote: { All: perfumersApprenticeInventory, Moe: inventory },
              local: {},
            }}
            search={search}
          ></FormulaCards>
        </div>
      </ContextMenuTrigger>
      <ContextMenu id="my-context-menu-1" appendTo="body">
        <ContextMenuItem>Menu Item 1</ContextMenuItem>
        <ContextMenuItem>Menu Item 2</ContextMenuItem>
        <ContextMenuItem>Menu Item 3</ContextMenuItem>
        <ContextMenuItem>Menu Item 4</ContextMenuItem>
      </ContextMenu>
    </div>
  );
};

export const PublishPage = () => {
  const params = useParams();

  return (
    <div className="h-full w-full relative flex justify-center page">
      {ReactDOM.createPortal(
        <>
          <div></div>
          <link
            rel="canonical"
            href={`https://javscript.moe/${params.language}/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="de"
            href={`https://javscript.moe/de/formula/compose`}
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://javscript.moe/en/formula/compose`}
          />

          <link
            rel="icon"
            type="image/png"
            href="/icons/inventory/favicon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/icons/inventory/favicon.svg"
          />
          <link rel="shortcut icon" href="/icons/inventory/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/inventory/apple-touch-icon.png"
          />
          <link rel="manifest" href="/icons/inventory/site.webmanifest" />
          <meta
            name="description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:title"
            content="Perfumery Ingredients Inventory"
            data-react-helmet="true"
          />
          <meta
            property="og:description"
            content="A free inventory web app for perfumery ingredients. Inventorize your ingredient collection and keep track of what you have."
          />
          <meta
            property="og:image"
            content="https://javascript.moe/images/inventory.png"
          />
          <meta
            property="og:url"
            content="https://javascript.moe/en/inventory"
          />
          <title>Perfumery Ingredients | Formula Builder</title>
        </>,
        document.head
      )}
      <EnsureLanguage path="/formula/compose" />

      <div className="absolute top-0  max-w-[100vw] flex h-full w-full">
        <img src="/images/wallpaper/ingredients.jpg" className="w-full" />
      </div>
      <div className="flex flex-col gap-4 w-[100vw]  mx-auto p-1 lg:p-4 bg-black/40 text-white h-full ">
        <div className="backdrop-blur-sm h-screen w-[320px] mx-auto bg-black/20 flex flex-col overflow-y-auto p-4">
          <FormulaPublisher
            inventories={{
              remote: {
                All: perfumersApprenticeInventory,
                Moe: inventory || [],
              },
              local: {
                Local: [],
              },
            }}
          ></FormulaPublisher>
        </div>
      </div>
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
export const Spectogram = ({ data, sort }: { data: any; sort: number }) => {
  const bp = useCurrentBreakpoint();
  const bps = [bp === "3xs", bp === "2xs", bp === "xs"];
  const isMobile = bps.some(Boolean);
  return (
    <div className="mt-8">
      <ResponsiveContainer width={"100%"} height={400}>
        <ComposedChart
          data={data}
          margin={{
            bottom: 120,
            left: 0,
            right: 32,
          }}
        >
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
            hide={sort > 1}
            yAxisId="left"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "green" }}
            axisLine={{
              fill: "green",
              stroke: "green",
              filter: "drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4))",
            }}
          />
          <YAxis
            hide={sort !== 2}
            yAxisId="left-2"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "orange" }}
            axisLine={{
              fill: "orange",
              stroke: "orange",
              filter: "drop-shadow(1px 1px 2px rgb(0 0 0 / 0.4))",
            }}
          />
          <YAxis
            hide
            yAxisId="right"
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

  const bp = useCurrentBreakpoint();
  // const { scrollYProgress: scrollInner } = useScroll({
  //     layoutEffect: false,
  //     container: innerRef || undefined,
  //     offset: ["start start", "end end"]
  // });

  const vh = getVH(100);
  const smallHeight = vh < 420;
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

  const bps = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl"];
  const cInd = bps.indexOf(bp);
  const lkp: Record<string, any> =
    typeof bgSrc === "string"
      ? {
          [bp]: bgSrc,
        }
      : {
          ...bgSrc,
        };

  let largest = bps[0];
  for (let i = 0; i <= cInd; i++) {
    if (lkp[bps[i]]) {
      largest = bps[i];
    }
  }
  const bgImg = lkp[bp] || lkp[largest];
  return (
    <>
      <BackgroundImage src={bgImg} alt={bgAlt} />
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
          distance={
            (smallHeight ? vh : dist) + (smallHeight ? -32 * 2 : 32 * 2)
          }
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
              className="flex flex-col  overflow-y-scroll max-h-[calc(100vh-120px)] min-h-[420px] rounded-md shadow-lg shadow-black  text-left"
            >
              <motion.div
                ref={innerRef}
                className="relative flex flex-col sm:flex-row  gap-4 p-1 lg:p-4 "
              >
                {/* <motion.div style={{ display: 'block' }} /> */}

                <div className="top-4">
                  <FadingImage
                    src={imgSrc || []}
                    className=" sticky top-4  object-cover xsls:landscape:mt-8"
                    alt={imgAlt}
                    style={{ x: 0, borderRadius: bi, opacity }}
                  />
                </div>
                <div className=" w-full">
                  {/* <motion.p className="text-left px-4  whitespace-pre-line " style={{ filter: blur, textShadow: '1px 1px 1px black' }}>{text}</motion.p> */}

                  <div
                    className="bg-[#00000044] p-1"
                    style={{
                      textShadow: "1px 1px 3px black",
                      boxShadow: "0px 0px 5px 1px black",
                      backdropFilter:
                        "blur(12px) brightness(80%) saturate(200%)",
                    }}
                  >
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
                sort={sort}
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
          distance={dist - 32 - 16}
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
                <div className="flex flex-row  gap-2 flex-wrap sm:flex-nowrap">
                  {Images[ing.name] && (
                    <FadingImage
                      src={Images[ing.name]}
                      alt={`Depiction for ${ing.name}`}
                    />
                  )}
                  <p style={{ padding: "0px" }}>{ing.exp.desc}</p>
                </div>
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
  const to = useRef<NodeJS.Timeout>(0 as any);
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

  const [target, setTarget] = useState<number | null>(null);
  const value =
    unit === 0
      ? totalDrops
      : unit === 1
      ? drops2Grams(totalDrops) / denomGrams
      : unit === 3
      ? drops2ml(totalDrops)
      : 100;
  const factor = (target || value) / value;
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
        <ArrowRight style={{ color: "#FFF" }} />
        <input
          className="w-[6ch] pr-[24px]"
          type="text"
          value={target || ""}
          onChange={(e) => setTarget(Number(e.target.value))}
        ></input>
        <button
          onClick={() => setTarget(null)}
          className="text-black -translate-x-2 bg-white items-center flex text-center"
        >
          <Cross />
        </button>
      </div>
      {ingredients.map((ing) => {
        const { amount, dilution, name, company, exp } = ing;
        const showTooltip = visible === name && !!part;

        const drops = toDrops(amount) / denomDrops;
        const grams =
          (drops2Grams(toDrops(amount)) / denomGrams) *
          ((dilution || 100) / 100);
        const ml =
          (drops2ml(toDrops(amount)) / denomMl) * ((dilution || 100) / 100);
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
                  ? round(factor * drops) + "dr"
                  : unit === 1
                  ? round(factor * grams) + "g"
                  : unit === 3
                  ? round(factor * ml) + "ml"
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

  const bp = useCurrentBreakpoint();
  const isMobile = [bp === "2xs", bp === "xs"].some(Boolean);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["calc(0vh + 32px)", "calc(50vh + 32px)"] : ["0vh", "50vh"]
  );
  return ReactDOM.createPortal(
    <motion.div
      style={{ y }}
      className={clsx(
        "overflow-y-scroll whitespace-pre-line absolute z-[1000] max-h-[40vh] sm:max-h-[100vh] sm:h-[100vh] w-[100vw] sm:w-[22vw] top-4 sm:top-0 right-0 transition-opacity  bg-[black] p-4 text-white",
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
