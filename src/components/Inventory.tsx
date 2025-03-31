import { useIndexedDB } from "react-indexed-db-hook";
import ReactDOM from "react-dom";
import { IconButton } from "./Button";
import { ActionInput, Input } from "./Input";
import { List, ListItem } from "./List";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollContainer } from "./ScrollContainer";
import fls from "fast-levenshtein";
import clsx from "clsx";
import copy from "copy-to-clipboard";
import { ingredients, thumbnails } from "../static/assets";
import {
  allOdors,
  OdorColors,
  perfumeIngredientsDesc,
  perfumeIngredientsOdours,
  TagColors,
  TagIcons,
} from "../static/descriptions";
import PALogo from "../assets/logos/PerfumersApprentice.png";
import { Chip, Component, OdorChip } from "./Chip";
import { between } from "../utils/numbers";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { groupByTitle, normalize } from "@/utils/perfumersApprentice";
import { useCurrentBreakpoint, isSmaller } from "@/hooks/useBreakpoint";
import { Icon } from "./Icon";
import { lngLnk, toggle, trim } from "@/lib/util";
import { importPlainText } from "@/utils/app";
import { useNavigate, useParams } from "react-router";
import i18next from "i18next";
import { Link, useSearchParams } from "react-router-dom";
import { ActionButton } from "./ActionButton";
import { ToggleButton } from "./ToggleButton";
import { NavButton } from "./NavButton";
import { inventory, pellwall, perfumersApprentice } from "@/static/inventory";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";
import { getDisplayCAS } from "@/utils/item";
import { Sources } from "libperfumery/dist/types/Sources";
import { Tooltip } from "react-tooltip";

export const getMostExpensive = (list: Item[]) => {
  const e = list
    .filter((itm) => {
      return itm.onStock;
    })
    .sort((a, b) => {
      return Number(getRawPricePerMl(b)) - Number(getRawPricePerMl(a));
    })
    .slice(0, 5);

  return e;
};

export const getMostOnStock = (list: Item[]) => {
  return list
    .slice()
    .filter((itm) => {
      return itm.onStock && itm.price;
    })
    .sort((a, b) => {
      return (
        (getGrams(b.size) - getGrams(a.size)) * 2 +
        (getRawPricePerMl(b) - getRawPricePerMl(a)) * 1
      );
    })
    .filter((a, i, arr) =>
      arr.slice(i + 1).some((itm) => itm.title === a.title)
    )
    .slice(0, 10);
};

export const amountToNumber = (amount = "0g") => {
  return Number(amount?.replace(/(g|kg|ml|l)/, ""));
};

export const getGrams = (amount = "0g") => {
  // console.log ("GET GRAMS", amount)
  const raw = amountToNumber(amount);
  if (amount.includes("ml")) return raw;
  if (amount.includes("l")) return raw * 1000;
  if (amount.includes("kg")) return raw * 1000;
  if (amount.includes("g")) return raw;
  return raw;
};

export const getRawPrice = (price = "0$") => {
  return Math.round(100 * Number(price.replace(/[$€]/, ""))) / 100;
};

export const getCurrency = (price = "0$") => {
  // console.log ("GET GRAMS", amount)
  if (price.includes("€")) return "€";
  if (price.includes("$")) return "$";
  return "$";
};

export const getPriceAndCurrency = (price = "0$") => {
  // console.log ("GET GRAMS", amount)
  if (price.includes("€")) return "€";
  if (price.includes("$")) return "$";
  return "$";
};

export const getAmountUnit = (amount = "0g") => {
  return amount?.replace(/\d+/, "");
};

export const getPrice = (entry: Pick<NormalizedItem, "price">) => {
  return Number(
    entry.price?.replace(/[$€£]/, "").replace("GBP", "").trim() || 0
  );
};
export const getPriceInDollar = (price = "0$") => {
  // console.log ("GET GRAMS", amount)
  const raw = getPrice({ price });
  if (price.includes("€")) return raw * (1 / 0.92) + "$";
  if (price.includes("£")) return raw * (1 / 0.77) + "$";
  if (price.includes("$")) return price;
  return raw;
};
export const getDilution = (entry: Pick<NormalizedItem, "dilution">) => {
  return Number(entry.dilution?.replace(/[%]/, "")) || 100;
};

export const getRawPricePerMl = (
  entry: Pick<any, "size" | "price" | "dilution"> | null
) => {
  if (entry === null) return 0;
  const nr = getGrams(entry.size);
  const prc = getPrice(entry);
  const dil = getDilution(entry);
  return Math.round(100 * (prc / nr) * (100 / dil)) / 100;
};

export const getPricePerMl = (
  entry: Pick<NormalizedItem, "size" | "price" | "dilution"> | null
) => {
  if (entry === null) return 0;
  const nr = getGrams(entry.size);
  const prc = getPrice(entry);

  return Math.round(100 * (prc / nr)) / 100;
};

export const getPricePerUnit = (
  entry: Pick<NormalizedItem, "size" | "price" | "dilution"> | null
) => {
  if (entry === null) return 0;
  const nr = getGrams(entry.size);
  const cur = getCurrency(entry.price);
  const prc = getPrice(entry);
  const intl = new Intl.NumberFormat(i18next.language, {
    unit: units[getAmountUnit(entry?.size)],
    currency: currencyCodes[cur],
    unitDisplay: "short",
    style: "currency",
  });
  return (
    intl.format(Math.round((prc / nr) * 100) / 100) +
    "/" +
    getAmountUnit(entry?.size)
  );
};

const currencyCodes = {
  $: "USD",
  "£": "GBP",
  "€": "EUR",
};

const units = {
  g: "gram",
  ml: "milliliter",
} as Record<string, string>;
export const getDisplayPrice = (price: string) => {
  const frm = new Intl.NumberFormat(i18next.language, {
    currency: currencyCodes[getCurrency(price)],
    currencySign: "standard",
    compactDisplay: "short",
    currencyDisplay: "symbol",
    style: "currency",
  });
  return frm.format(getPrice({ price }));
};

export type Item = NormalizedItem & {
  list?: string | null;
  id?: number;
  quantity?: number;
  onStock?: boolean;
  remote?: boolean;
  baseUrl?: string;
  link?: string;
  local?: Item | null;
};

export type GroupedItem = {
  title: string;
  tags: string[];
  aliases: string[];
  id: number;
  cas?: string;
  onStock?: boolean;
  items: Item[];
};
export type AutoSuggestItem = NormalizedItem & {
  id: string;
  name: string;
};

export type FormulaItem = NormalizedItem & {
  amount?: string;
  usedAmount?: number;
  unit?: string;
  token?: string;
};

export type Formula = {
  published?: boolean;
  author?: string;
  id?: number;
  remoteId?: string;
  token?: string;
  stars?: number;
  identityStars?: number;
  title?: string;
  items: FormulaItem[];
};

export type Inventories = Record<string, NormalizedItem[]>;
export type LocalInventories = Record<string, Item[]>;
export const InventoryList = ({
  list: initialList = [],
  inventories = { remote: {}, local: {} },
}: {
  list?: Item[];
  inventories: {
    remote: Inventories;
    local: LocalInventories;
  };
}) => {
  const db = useIndexedDB("inventory");
  const [storedListLkp, setStoredLkp] = useState<Record<string, Item[]>>(
    inventories?.local || {}
  );

  const params = useParams<{
    list: string;
    title: string;
    amount: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const [hideOnStock, setHideOnStock] = useState<0 | 1 | 2>(0);
  const [invRemote, setInvRemote] = useState<Sources | string | null>(
    params?.list === "*" ? "" : params.list || ""
  );
  const [invLocal, setInvLocal] = useState<string | null>(
    searchParams.get("library") || "Local"
  );

  useEffect(() => {
    setInvLocal(searchParams.get("library"));
  }, [searchParams]);

  const [sort, setSort] = useState<string>("+AZ");
  const [notification, setNotification] = useState<string>("");

  const storedList = storedListLkp[invLocal || "Local"] || [];
  const [localLists, setLocalLists] = useLocalStorage(
    Object.keys(inventories?.local || {}),
    "localLists"
  );

  const availList = (
    invRemote && invRemote !== "*"
      ? inventories.remote?.[invRemote] || []
      : initialList
  ) as Item[];
  const available = availList.map((itm) => {
    return {
      ...itm,
      title: itm?.title?.trim(),
      //   onStock: false,
      quantity: 1,
      remote: true,
      local: !invLocal
        ? null
        : Object.values(storedListLkp)
            .flat()
            ?.find((sitm) => {
              return (
                itm.title?.trim() === sitm.title?.trim() &&
                itm.size === sitm.size
              );
            }),
    };
  });

  const emptyStock = !available.some((itm) => {
    return itm.onStock;
  });

  const targetHasAll = available
    .filter((itm) => {
      return itm.onStock;
    })
    .some((itm) => {
      return storedList.some((sitm) => {
        return (
          itm.title?.trim() === sitm.title?.trim() && itm.size === sitm.size
        );
      });
    });
  const list = (!invRemote ? storedList : available) as Item[];

  const load = async () => {
    const res = (await db.getAll()) || [];
    setLocalLists(
      [
        ...new Set([
          ...Object.keys(inventories?.local),
          ...localLists,
          ...res.map((itm) => {
            return itm.list;
          }),
        ]),
      ].filter(Boolean)
    );
    setStoredLkp({
      ...storedListLkp,
      ...res.reduce((acc, itm) => {
        return { ...acc, [itm.list]: [...(acc[itm.list] || []), itm] };
      }, {}),
    });
  };

  const add = async (props: Partial<Item>) => {
    const res = await db.add(props);
    const toAdd = {
      ...props,
      quantity: Number(props.quantity),
      id: res,
      list: invLocal || "Local",
    } as unknown as NormalizedItem;
    (setStoredLkp as any)((list: Record<string, Item[]>) => ({
      ...list,
      [invLocal || "Local"]: [...list[invLocal || "Local"], toAdd],
    }));
  };

  const del = async (id: number, noUpdate?: boolean) => {
    await db.deleteRecord(id);
    if (noUpdate) return;
    const index = list.findIndex((itm) => {
      return itm.id === id;
    });

    setStoredLkp((list) => {
      const newList = { ...list };
      newList[invLocal || "Local"] = newList[invLocal || "Local"] || [];
      newList[invLocal || "Local"].splice(index, 1);
      return newList;
    });
  };

  const deleteList = async () => {
    setStoredLkp({ [invLocal || "Local"]: [] });
    storedList.forEach((itm) => itm.id && del(itm.id, true));
    setInvRemote(null);
  };
  const upd = async (id?: number, item?: Partial<Item>) => {
    const {
      title,
      size = "4ml",
      quantity = 1,
      onStock,
      price = "0$",
      dilution = "100%",
      list = "Local",
    } = item || {};
    const existing =
      storedList.find((itm) => {
        return itm.id === id && itm.size === size && itm.title === title;
      }) || {};
    const index = storedList.findIndex((itm) => {
      return itm.id === id && itm.size === size && itm.title === title;
    });

    const toAdd = normalize({
      ...existing,
      title: title!,
      size,
      quantity,
      onStock,
      price,
      dilution,
      id,
      remote: false,
      source: "local" as any,
      list,
    });
    if (id) {
      await db.update({
        ...existing,
        ...toAdd,
        id,
      });
    } else {
      await db.add({
        ...toAdd,
        list: invLocal,
      });
    }

    console.log("UPDATE", existing, toAdd);
    setStoredLkp((storedList) => {
      const newList = { ...storedList };
      const newItems = newList[invLocal || "Local"].slice();
      newItems.splice(index, index > -1 ? 1 : 0, toAdd);
      newList[invLocal || "Local"] = newItems;
      return newList;
    });
    // if (selected?.local?.id === id) {
    // setSelected(toAdd);
    // }
  };

  useEffect(() => {
    if (!invLocal || !localLists?.includes(invLocal))
      setLocalLists([...Object.keys(inventories?.local)]);
    if (invLocal) load();
  }, [invLocal]);

  const [search, setSearch] = useState("");
  const odors = decodeURIComponent(searchParams.get("odors") || "")
    ?.split(",")
    .map(trim)
    .filter(Boolean);

  const [filter, osetFilter] = useState<string[]>(odors);
  const [filterType, setFilterType] = useState(
    searchParams.get("filter") || "OR"
  );
  const [selected, setSelected] = useState<Partial<Item> | null | undefined>(
    undefined
  );
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showTags, setShowTags] = useState<boolean>(false);
  const bp = useCurrentBreakpoint({ current: document.body });
  const isMobile = isSmaller(bp, "md");
  const { list: listName } = useParams();
  const [listAliases] = useLocalStorage<Record<string, string>>(
    {},
    "listNames"
  );

  const setFilter = (filter: string[]) => {
    setSearchParams(
      filter?.length
        ? {
            odors: encodeURIComponent(filter.join(",")),
          }
        : {}
    );
    osetFilter(filter);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.list) {
      setInvRemote("Moe");
      navigate(lngLnk`/inventory/Moe`, { replace: true });
    }
  }, [params.list, navigate]);
  useEffect(() => {
    if (!params.list) return;
    if (!searchParams.get("library")) {
      searchParams.set("library", invLocal || "Local");

      navigate(
        lngLnk`/inventory/${params.list}/?` +
          searchParams.toString() +
          window.location.hash,
        {
          replace: true,
        }
      );
    }
  }, [params.list, searchParams?.get("library"), invLocal, navigate]);
  useEffect(() => {
    if (selected?.title) {
      if (
        selected?.title !== decodeURIComponent(params.title || "") ||
        selected?.size !== params?.amount
      ) {
        navigate(
          "/" +
            i18next.language +
            "/" +
            "inventory/" +
            (invRemote || "*") +
            "/" +
            encodeURIComponent(selected?.title || "") +
            (selected?.size ? "/" + selected?.size : "") +
            "?" +
            new URLSearchParams(searchParams).toString(),
          {
            replace: selected?.title === decodeURIComponent(params.title || ""),
          }
        );
      }
    } else if (selected === null) {
      navigate(
        "/" +
          i18next.language +
          "/" +
          "inventory/" +
          invRemote +
          "/" +
          window.location.search
      );
    }
    // setTimeout(() => setSearchParams((prev) => prev), 0);
  }, [selected?.title, selected?.size]);
  const filtered = list
    ?.filter((itm) => {
      if (hideOnStock === 0) return true;
      if (hideOnStock === 1) return !(itm.onStock || itm?.local?.onStock);
      if (hideOnStock === 2) return !!itm.onStock && !!itm?.local?.onStock;
    })
    .filter((itm) => {
      if (!filter?.length) return true;
      return filter[filterType === "AND" ? "every" : "some"]?.((o) =>
        perfumeIngredientsOdours?.[itm?.title]?.includes(o)
      );
    })
    .filter((itm) => {
      if (!search) return true;
      if (!itm.title) return false;

      if (search.includes(" "))
        return fls.get(search, itm?.title?.slice(0, search?.length)) <= 3;

      let minWordDist = 100;
      itm.title?.split(" ").forEach((word) => {
        const dist = fls.get(search, word.slice(0, search?.length));
        if (dist < minWordDist) minWordDist = dist;
      });
      return minWordDist <= 2;
    })
    .map((entry) => {
      const pricePerMl = getRawPricePerMl(entry);
      return { ...entry, pricePerMl };
    });
  const grouped = groupByTitle(filtered);
  const sorted = grouped.slice().sort((a: GroupedItem, b: GroupedItem) => {
    if (sort === "+AZ") return a.title?.localeCompare(b?.title) || 0;
    if (sort === "-AZ") return b.title?.localeCompare(a?.title) || 0;
    if (sort === "+price")
      return (
        Math.max(...(a.items?.map(getRawPricePerMl) || [])) -
        Math.max(...(b.items?.map(getRawPricePerMl) || []))
      );
    if (sort === "-price")
      return (
        Math.max(...(b.items?.map(getRawPricePerMl) || [])) -
        Math.max(...(a.items?.map(getRawPricePerMl) || []))
      );
    if (sort === "+amount")
      return getGrams(a.items?.at(-1)?.size) - getGrams(b.items?.at(-1)?.size);
    if (sort === "-amount")
      return getGrams(b.items?.at(-1)?.size) - getGrams(a.items?.at(-1)?.size);

    if (sort === "+odor")
      return (
        perfumeIngredientsOdours[a?.title]?.[0]?.localeCompare(
          perfumeIngredientsOdours[b?.title]?.[0] || "ZZZ"
        ) || 0
      );
    if (sort === "-odor")
      return (
        perfumeIngredientsOdours[b?.title]?.[0]?.localeCompare(
          perfumeIngredientsOdours[a?.title]?.[0] || "ZZZ"
        ) || 0
      );

    return 0;
  });

  useEffect(() => {
    if (!params?.title) return;
    const ingredient = inventories.remote[params?.list || "All"]?.find(
      (itm) => {
        const titleMatches = params.title === itm.title;
        const amountMatches = params.amount === itm.size;

        return params.amount ? titleMatches && amountMatches : titleMatches;
      }
    );

    if (!params?.list || !ingredient || !inventories?.remote[params?.list])
      return;

    setSelected(ingredient);
  }, [params.title, params.list]);

  return (
    <div className="flex flex-col gap-1 w-full overflow-hidden h-full">
      {notification && (
        <Notification
          title={notification}
          setNotification={setNotification}
        ></Notification>
      )}
      {showAdd && (
        <form
          action="#"
          onSubmit={(e) => {
            const data = new FormData(e.target as HTMLFormElement);
            const obj = Object.fromEntries(data);

            e.preventDefault();
            add(obj);
          }}
        >
          <div className="flex gap-1 w-full items-center flex-wrap ">
            <Input
              name="quantity"
              type="number"
              className="flex-shrink w-[4ch] h-[34px]"
            ></Input>
            <select name="amount" className="bg-black/80 border-b-2 h-[34px]">
              <option value="4ml">4ml</option>
              <option value="15ml">15ml</option>
              <option value="50g">50g</option>
              <option value="60g">60g</option>
              <option value="250g">250g</option>
              <option value="500g">500g</option>
            </select>
            <Input
              onPaste={(e) => {
                const text = e.clipboardData?.getData("text");
                importPlainText(add, text);
              }}
              //   type="submit"
              name="title"
              placeholder="Paste plain text export or enter a title."
              className="flex-1 h-[34px]"
            ></Input>
            <select name="dilution" className="bg-black/80 border-b-2 h-[34px]">
              <option value="5%">5%</option>
              <option value="10%">10%</option>
              <option value="20%">20%</option>
              <option value="50%">50%</option>
            </select>
            <Input
              name="price"
              type="currency"
              className="w-[7ch] h-[34px] pr-[34px]"
            ></Input>
            <Icon
              icon="FaDollarSign"
              className="-ml-[34px] h-6 w-6 mr-2"
            ></Icon>
            <IconButton icon="FaPlus" type="submit"></IconButton>
            <IconButton
              icon="FaSearch"
              onClick={() => {
                setShowAdd(false);
              }}
            ></IconButton>
          </div>
        </form>
      )}
      {showTags && (
        <div className="flex gap-1 flex-wrap">
          {
            <Chip
              label={filterType}
              onClick={() => setFilterType(filterType === "OR" ? "AND" : "OR")}
            ></Chip>
          }
          {allOdors.map((key: string) => {
            return (
              <Chip
                label={key}
                className={clsx("border-white/40 border-[1px] text-gray-200", {
                  "text-gray-400": !filter.includes(key),
                })}
                style={{
                  backgroundColor: filter.includes(key)
                    ? OdorColors[key] + "DD"
                    : OdorColors[key] + "33",
                }}
                onClick={() => setFilter(toggle(filter, key))}
              ></Chip>
            );
          })}
          {
            <IconButton
              icon="FaX"
              round
              className="ml-auto !h-7 !w-7 bg-red-600/40"
              onClick={() => setShowTags(false)}
            ></IconButton>
          }
        </div>
      )}
      {!showAdd && !showTags && (
        <div className="flex gap-1 items-center w-full">
          <IconButton
            icon="FaEye"
            className={clsx({
              "bg-green-600": hideOnStock === 2,
              "bg-yellow-600": hideOnStock === 1,
            })}
            onClick={() => {
              setHideOnStock(((hideOnStock + 1) % 3) as 0 | 1 | 2);
            }}
          ></IconButton>
          <IconButton
            className={clsx({
              "bg-green-700/40": sort === "+amount",
              "bg-red-700/40": sort === "-amount",
            })}
            icon={sort === "-amount" ? "FaSortAmountDown" : "FaSortAmountUp"}
            onClick={() => setSort(sort == "+amount" ? "-amount" : "+amount")}
          ></IconButton>
          <IconButton
            className={clsx("py-2", {
              "bg-green-700/40": sort === "+price",
              "bg-red-700/40": sort === "-price",
            })}
            onClick={() => setSort(sort == "+price" ? "-price" : "+price")}
          >
            <div className="flex">
              <Icon
                icon={sort === "-price" ? "FaArrowDownLong" : "FaArrowUpLong"}
                className="w-4 h-4 -mr-2"
              ></Icon>
              <Icon icon="FaDollarSign" className="w-4 h-4"></Icon>
            </div>
          </IconButton>
          <IconButton
            className={clsx({
              "bg-green-700/40": sort === "+AZ",
              "bg-red-700/40": sort === "-AZ",
            })}
            icon={sort === "-AZ" ? "FaSortAlphaDown" : "FaSortAlphaUp"}
            onClick={() => setSort(sort === "+AZ" ? "-AZ" : "+AZ")}
          ></IconButton>
          <IconButton
            className={clsx("h-full", {
              "bg-green-700/40": sort === "+odor",
              "bg-red-700/40": sort === "-odor",
            })}
            onClick={() => setSort(sort === "+odor" ? "-odor" : "+odor")}
          >
            <div className="flex mx-[1px] h-6 items-center">
              <Icon
                icon={sort === "-odor" ? "FaArrowDownLong" : "FaArrowUpLong"}
                className="w-4 h-4 -mx-[3px]"
              ></Icon>
              <Icon icon="FaTag" className="w-4 h-4"></Icon>
            </div>
          </IconButton>
          <ActionInput
            className="w-full h-full"
            placeholder="Filter"
            icon="FaSearch"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }}
          ></ActionInput>

          {!showAdd && (
            <IconButton
              icon="FaPlus"
              onClick={() => {
                setShowAdd(true);
              }}
            ></IconButton>
          )}
          {!showTags && (
            <div className="relative">
              <IconButton
                icon="FaTag"
                onClick={() => {
                  setShowTags(true);
                }}
              ></IconButton>
              <span
                className={clsx(
                  "absolute -bottom-4 -right-2 bg-red-600/70 px-2 py-1",
                  { hidden: !filter?.length }
                )}
              >
                {filter?.length}
              </span>
            </div>
          )}
          <ValueTags list={list} />
        </div>
      )}

      <div className="flex gap-4 overflow-hidden flex-1">
        {(isMobile ? !selected?.size : true) && (
          <div className="flex flex-col w-full basis-1/3 flex-1 h-full">
            <div className="flex justify-between flex-wrap mb-1 gap-1 items-center">
              <div className="flex gap-1 items-center bg-green-300/20 p-1 rounded-md w-full flex-1 mb-1">
                {Object.keys(inventories.remote).map((key) => {
                  return (
                    <div
                      className={clsx(
                        "gap-1 flex h-fit p-1 rounded-full items-center",
                        {
                          "bg-white/10": invRemote === key,
                        }
                      )}
                    >
                      <Chip
                        label={key}
                        className={clsx("border-orange-500 border-2", {
                          "bg-yellow-500/70": invRemote === key,
                          "hover:bg-yellow-500": invRemote === key,
                          "bg-white/30": invRemote !== key,
                        })}
                        onClick={() => {
                          setSelected(null);
                          const newInvRemote = key === invRemote ? "" : key;
                          setInvRemote(newInvRemote);
                          const search = new URLSearchParams(
                            window.location.search
                          );
                          search.set("library", invLocal || "Local");
                          navigate(
                            lngLnk`/inventory/${newInvRemote || "*"}/?` +
                              search.toString() +
                              window.location.hash,
                            {
                              replace: true,
                            }
                          );
                        }}
                      ></Chip>
                    </div>
                  );
                })}
                <NavButton
                  id="navbtnfragrancebuilder"
                  tooltip={
                    invRemote === "All"
                      ? `Ingredients in 'All' are incomplete. The fragrance builder might not work as intended.`
                      : `Open the library '${invRemote}' in the fragrance builder.`
                  }
                  className="ml-auto text-blue-500"
                  icon="FaFlask"
                  internal
                  onClick={() =>
                    navigate(
                      `/${i18next.language}/formula/compose?library=${invRemote}`
                    )
                  }
                ></NavButton>
              </div>
              {listName === invRemote &&
                !emptyStock &&
                !!invLocal &&
                !targetHasAll && (
                  <IconButton
                    id="downloadbtn"
                    tooltip={
                      !invLocal
                        ? "Select a local list to transfer items to."
                        : `Copy items to the '${invLocal}' list in your indexed db.`
                    }
                    disabled={!invLocal || targetHasAll}
                    round
                    className="w-7 h-7 text-white  bg-green-700/70"
                    icon="FaArrowRightFromBracket"
                    onClick={async () => {
                      const onStock = (available?.filter((itm) => {
                        return itm.price;
                      }) || []) as Item[];
                      for (const itm of onStock) {
                        await upd(itm?.id, { ...itm, list: invLocal });
                      }
                    }}
                  ></IconButton>
                )}
              <LocalListChips
                listNames={localLists}
                onChange={(library) => {
                  const search = new URLSearchParams(window.location.search);
                  search.set("library", library || "Local");
                  navigate(
                    lngLnk`/inventory/${invRemote || "*"}/?` +
                      search.toString() +
                      window.location.hash
                  );
                }}
                onDelete={deleteList}
                setNotification={setNotification}
                onRemove={(key) => {
                  setLocalLists(localLists?.filter((k: string) => k !== key));

                  if (invLocal === key) setInvLocal(localLists[0]);
                }}
                hasAll={targetHasAll}
                onAdd={(key: string | null) => {
                  setLocalLists([...localLists, key!].filter(Boolean));
                }}
                items={(storedList || []) as Item[]}
                value={invLocal}
              ></LocalListChips>
            </div>

            <ScrollContainer className="">
              <List key={filtered.length} className="px-2 flex flex-col gap-1">
                {sorted.map((entry) => {
                  return (
                    <ListItem
                      className={clsx({
                        "bg-white/30": selected?.title === entry?.title,
                      })}
                      key={entry.title}
                      onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                        if ((e.target as HTMLInputElement).type === "INPUT")
                          return;
                        setSelected(selected?.id === entry?.id ? null : entry);
                      }}
                    >
                      <IngredientItem
                        {...(entry as any)}
                        selected={selected}
                        upd={upd}
                        setSelected={setSelected}
                        list={invLocal as any}
                        source={invRemote as any}
                        setNotification={setNotification}
                        toggleFilter={(key) => {
                          // setShowTags(true);
                          setFilter(toggle(filter, key));
                        }}
                        filter={filter}
                      ></IngredientItem>
                    </ListItem>
                  );
                })}
              </List>
            </ScrollContainer>
            {!filtered?.length && (
              <div className="my-auto mx-auto text-center">
                {hideOnStock === 0 && (
                  <p>You don't have any matching ingredients.</p>
                )}
                {hideOnStock === 2 && (
                  <p>
                    You don't have any local ingredients that are available in
                    the remote list.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {!!selected && (isMobile ? !!selected?.size : true) && (
          <IngredientDetail
            inventories={{
              remote: {
                PA: perfumersApprentice,
                PW: pellwall,
                Moe: inventory || [],
              },
              local: {
                Local: [],
              },
            }}
            invRemote={""}
            invLocal={invLocal || "Local"}
            selected={selected!}
            setSelected={setSelected}
            list={list as Item[]}
            sorted={sorted}
            emptyStock={emptyStock}
            listAliases={listAliases}
            storedList={storedList}
            upd={upd}
          ></IngredientDetail>
        )}
      </div>
    </div>
  );
};

const Tag = ({
  label,
  children,
  className,
  tooltip,
  id,
  semibold,
}: PropsWithChildren<{
  label: string;
  className?: string;
  tooltip?: string | ReactNode;
  id?: string;
  semibold?: boolean;
}>) => {
  const [not, setNot] = useState<string>("");
  return (
    <>
      {not &&
        ReactDOM.createPortal(
          <Notification title={not} setNotification={setNot} />,
          document.body
        )}
      <button
        id={`${id}-tag`}
        className={clsx("bg-white/5 p-[2px] flex items-center ", className)}
        onClick={() => {
          if (typeof children !== "string") return;
          copy(children);
          setNot("Copied " + label);
        }}
      >
        <div className="bg-black/20 p-1 font-bold">{label}</div>
        <div
          className={clsx("bg-white/20 p-1 ", { "font-semibold": semibold })}
        >
          {children}
        </div>
      </button>
      {ReactDOM.createPortal(
        <Tooltip
          anchorSelect={`#${id}-tag`}
          id={`${id}-tag-tooltip`}
          place="right"
        >
          {tooltip || (
            <div className="flex gap-1 font-semibold items-center">
              <Icon icon="FaCopy" className="h-4 w-4" />
              Copy
            </div>
          )}
        </Tooltip>,
        document.body
      )}
    </>
  );
};

const ValueTags = ({ list }: { list: Item[] }) => {
  const uniqueIngredientsOnStock = [
    ...new Set(
      list
        .filter((itm) => {
          return getPrice(itm);
        })
        .map((itm) => {
          return itm.title;
        })
    ),
  ];
  const totalValue = (list as Item[])
    .filter((itm) => {
      return getPrice(itm);
    })
    .reduce((total, itm) => {
      return total + getPrice(itm);
    }, 0);

  const { list: listName } = useParams();
  return (
    <div className="flex gap-1 items-center">
      <Tag
        id="uniqueingredients"
        label={uniqueIngredientsOnStock?.length.toString()}
        className="ml-auto md:ml-0 !bg-sky-500/70 h-8 items-center text-lg font-semibold border-2 "
        tooltip={
          "Number of unique ingredients in the list  '" + listName + "'."
        }
      >
        <Icon icon="FaBottleDroplet" className="!h-5 !w-5 " />
      </Tag>
      <Tag
        id="total"
        label={Math.round(totalValue).toString()}
        tooltip={
          "Total value of all ingredients in the list '" + listName + "'."
        }
        className="bg-yellow-500/70 h-8 items-center text-lg font-semibold border-2"
      >
        <Icon icon="FaDollarSign" className="!h-5 !w-5 " />
      </Tag>
    </div>
  );
};

export type IngredientDetailProps = {
  selected: Partial<GroupedItem> | Partial<Item> | null;
  setSelected: (itm: Partial<Item> | null) => void;
  invRemote: string;
  invLocal?: string;
  inventories: { remote: Inventories; local: LocalInventories };
  filter?: string[] | null;
  list: GroupedItem[] | Item[];
  sorted: GroupedItem[];
  emptyStock?: boolean;
  storedList?: any;
  listAliases?: Record<string, string>;
  upd: any;
  expanded?: boolean;
};
export const IngredientDetail = ({
  selected,
  setSelected,
  invRemote,
  expanded,
  list,
  sorted,
  invLocal = "Local",
  inventories,
  listAliases,
  filter = null,
  emptyStock,
  storedList,
  upd,
}: IngredientDetailProps) => {
  const selectedItem = selected as Item;
  const bp = useCurrentBreakpoint({ current: document.body });
  const isMobile = isSmaller(bp, "md");

  const db = useIndexedDB("inventory");

  const [storedLkp, setStoredLkp] = useState<Record<string, NormalizedItem[]>>(
    {}
  );
  const [localLists, setLocalLists] = useLocalStorage(
    Object.keys(inventories?.local || {}),
    "localLists"
  );
  const loadLocalLists = async () => {
    const res = (await db.getAll()) || [];
    setLocalLists(
      [
        ...new Set([
          ...Object.keys(inventories?.local),
          ...localLists,
          ...res.map((itm) => {
            return itm.list;
          }),
        ]),
      ].filter(Boolean)
    );
    setStoredLkp({
      ...storedLkp,
      ...res.reduce((acc, itm) => {
        return { ...acc, [itm.list]: [...(acc[itm.list] || []), itm] };
      }, {}),
    });
  };

  const inventory =
    (invRemote
      ? inventories?.remote[invRemote]
      : storedLkp?.[invLocal.trim()]) || [];

  useEffect(() => {
    loadLocalLists();
  }, [invLocal, loadLocalLists, selected]);
  const add = async ({ id, ...props }: Partial<Item>) => {
    await db.add({ ...props, list: invLocal });

    // setStoredLkp((list) => ({
    //   ...list,
    //   [invLocal || "Local"]: [...list[invLocal || "Local"], toAdd],
    // }));

    if (inventories.local[invLocal]) await loadLocalLists();
    else {
      setLocalLists([...new Set([...localLists, invLocal])]);
    }
  };

  const del = async (id: number, noUpdate?: boolean) => {
    await db.deleteRecord(id);
    if (noUpdate) return;
    const index = list.findIndex((itm) => {
      return Number(itm.id) === id;
    });

    setStoredLkp((list) => {
      const newList = { ...list };
      newList[invLocal || "Local"] = newList[invLocal || "Local"] || [];
      newList[invLocal || "Local"].splice(index, 1);
      return newList;
    });
  };

  const navigate = useNavigate();
  const params = useParams();

  return (
    <div
      className={clsx(
        "detail flex flex-col  md:max-w-[66%] md:flex-shrink pb-0 gap-0 bg-black/70 sm:bg-black/0 ",
        {
          "absolute sm:relative left-0 !min-w-[100vw] max-w-[100vw] sm:!translate-x-0 sm:!min-w-0 max-h-screen sm:max-h-[auto]":
            expanded,
          "!w-full translate-x-[calc(100vw-48px)] sm:translate-x-0": !expanded,
        }
      )}
    >
      <div
        className="
      flex gap-1 flex-col lg:flex-row 
      lg:flex-wrap justify-between bg-white/20
      p-2 rounded-t-md items-center h-fit w-full"
      >
        <div className="flex gap-1  items-center ">
          <IconButton
            className=""
            round
            icon="FaChevronLeft"
            onClick={() => {
              const sel = sorted
                ?.filter((itm) => itm.title === selected?.title)
                .at(-1);
              const index = sel ? sorted?.indexOf(sel) : -1;
              setSelected(
                sorted[(sorted?.length + index - 1) % sorted?.length]
              );
            }}
          ></IconButton>
          <IconButton
            className=""
            round
            icon="FaChevronRight"
            onClick={() => {
              const sel = sorted
                ?.filter((itm) => itm.title === selected?.title)
                .at(-1);
              const index = sel ? sorted?.indexOf(sel) : -1;
              setSelected(sorted[(index + 1) % sorted?.length]);
            }}
          ></IconButton>
        </div>
        <div className="flex flex-col mx-auto items-start justify-start ">
          {selected?.title ? (
            <h2 className="line-clamp-1">{selected?.title}</h2>
          ) : (
            <h2 className="line-clamp-1">{invRemote}</h2>
          )}
          {!!selected?.aliases?.length && (
            <em>{selected?.aliases?.join(", ")}</em>
          )}
        </div>

        <div className="flex gap-1  justify-end items-center">
          {selected &&
            (!isMobile ? (
              <ActionButton
                level={1}
                icon={isMobile ? "FaChevronRight" : "FaX"}
                className="!rounded-l-full sm:!rounded-l-none"
                onDestruct={() => {
                  setSelected(
                    isMobile
                      ? { title: selectedItem?.title, size: selectedItem?.size }
                      : null
                  );
                }}
              ></ActionButton>
            ) : (
              <ToggleButton
                active={!!expanded}
                icon={isMobile ? "FaChevronRight" : "FaX"}
                className="!rounded-l-full sm:!rounded-l-none"
                onClick={() => {
                  setSelected(
                    isMobile
                      ? { title: selectedItem?.title, size: selectedItem?.size }
                      : null
                  );
                }}
              ></ToggleButton>
            ))}
        </div>
      </div>
      {!!selected?.title && (
        <div
          className={clsx(
            "max-w-full overflow-y-auto  h-full rounded-b-md bg-white/10",
            {}
          )}
          onDragEnter={(e) => {
            e.preventDefault();
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          // onDrop={(event) => {
          //   event.preventDefault(); // Prevent default browser behavior
          //   const file = event.dataTransfer.files[0];

          //   // Ensure the dropped file is an image
          //   if (file && file.type.startsWith("image/")) {
          //     const reader = new FileReader();

          //     reader.onload = (e) => {
          //       const imageDataUrl = e.target?.result;
          //       if (selected) upd(selected?.id, { imgUrl: imageDataUrl }); // Call function to store the image
          //     };

          //     reader.readAsDataURL(file); // Read file as Data URL
          //   }
          // }}
        >
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 p-1 ">
            <div className="w-full  sm:w-[40%] md:w-full lg:w-[30%]  h-fit lg:sticky top-2 flex flex-col gap-2">
              {<img src={ingredients[selectedItem?.title?.trim()]} />}
              <div className="flex flex-wrap gap-1 h-fit items-center">
                {selectedItem?.source &&
                  selectedItem?.baseUrl &&
                  selectedItem?.link && (
                    <Link
                      to={selectedItem?.baseUrl + selectedItem?.link}
                      target="_blank"
                    >
                      <NavButton
                        tooltip={selectedItem?.source}
                        tooltipPlacement="right"
                        id="shopNavButton"
                        icon="FaShoppingCart"
                        className="bg-sky-500  !h-7 !w-7 !p-0"
                      >
                        <img
                          src={PALogo}
                          className="absolute h-6 w-6 opacity-100 hover:opacity-0"
                        />
                      </NavButton>
                    </Link>
                  )}

                <Tag label="Price" id={"pricetag"} semibold>
                  {getDisplayPrice(selectedItem?.price)}
                </Tag>
                <Tag
                  label={`${getCurrency(selectedItem?.price)}/${getAmountUnit(
                    selectedItem?.size
                  )}`}
                  id={"mlpricetag"}
                  semibold
                >
                  {getDisplayPrice(
                    getPricePerMl(selectedItem) +
                      getCurrency(selectedItem.price)
                  )}
                </Tag>
                {selectedItem?.size && (
                  <Tag label="Size" id="sizetag">
                    {(
                      amountToNumber(selectedItem?.size) *
                        (selectedItem?.quantity || 1) +
                      getAmountUnit(selectedItem?.size)
                    ).toString()}
                  </Tag>
                )}

                <Tag label="CAS" id="castag">
                  {getDisplayCAS(selected?.cas)}
                </Tag>

                {selectedItem?.attributes?.map((attr) => {
                  return (
                    <Tag label={Object.keys(attr)[0]}>
                      {Object.values(attr)[0]?.toString()}
                    </Tag>
                  );
                })}
                
                {false &&
                  (selectedItem?.local?.onStock ||
                    (!selectedItem?.remote && selectedItem?.onStock)) && (
                    <Chip
                      // onClick={() =>
                      //   // setInvLocal(selected?.local?.list || "Local")
                      // }
                      icon="FaCheck"
                      className={clsx("w-fit", {
                        "bg-green-600":
                          invLocal === selectedItem?.local?.list ||
                          invLocal === selectedItem?.list,
                        "bg-yellow-500":
                          invLocal !== selectedItem?.local?.list &&
                          invLocal !== selectedItem?.list,
                      })}
                      label={
                        listAliases?.[
                          selectedItem?.list ||
                            selectedItem?.local?.list ||
                            "Local"
                        ] ||
                        selectedItem?.list ||
                        selectedItem?.local?.list ||
                        "In collection"
                      }
                    ></Chip>
                  )}
                {between(
                  getRawPricePerMl?.(selected as NormalizedItem),
                  10,
                  20
                ) && <Chip className="bg-yellow-300 w-fit" label="$"></Chip>}
                {between(
                  getRawPricePerMl?.(selected as NormalizedItem),
                  20,
                  30
                ) && <Chip className="bg-yellow-400 w-fit" label="$$"></Chip>}
                {between(
                  getRawPricePerMl?.(selected as NormalizedItem),
                  30,
                  100
                ) && <Chip className="bg-yellow-500 w-fit" label="$$$"></Chip>}
                {between(
                  getRawPricePerMl?.(selected as NormalizedItem),
                  100,
                  1000
                ) && <Chip className="bg-yellow-600 w-fit" label="🤯"></Chip>}
              </div>

              <div className="flex flex-wrap gap-1 h-fit">
                {selected?.tags?.map((tag) => {
                  return (
                    <Chip
                      label={tag}
                      icon={TagIcons[tag]}
                      style={{
                        backgroundColor: TagColors[tag],
                      }}
                    ></Chip>
                  );
                })}
              </div>

              <LocalListChips
                showButtons={false}
                toInventory={!window.location.pathname.includes("/inventory/")}
                listNames={localLists}
                // onAdd={ing => ing && add(ing)}
                // onDelete={(id) => del(id)}
                value={invLocal}
                items={inventory as Item[]}
                onChange={(library) => {
                  const search = new URLSearchParams(window.location.search);
                  search.set("library", library || "Local");
                  if (window.location.pathname.includes("/inventory/")) {
                    navigate(
                      lngLnk`/inventory/${
                        params.list || "*"
                      }/${encodeURIComponent(params.title!)}${
                        params.amount ? "/" + params.amount! : ""
                      }?` +
                        search.toString() +
                        window.location.hash
                    );
                  } else {
                    navigate(
                      lngLnk`/formula/${params.author!}/${params.title!}/?` +
                        search.toString() +
                        window.location.hash
                    );
                  }
                }}
              ></LocalListChips>

              <div className="flex gap-1 flex-wrap">
                {inventories?.remote?.Moe.filter(
                  (i) => i.title === selected.title
                ).map((selected) => {
                  const local = inventory.find(
                    (i) =>
                      i.title === selected?.title && i.size == selected?.size
                  ) as Item;
                  const inLib = !!local?.id;
                  return (
                    <Chip
                      id={"size" + selected?.size}
                      className={clsx(
                        {
                          "bg-yellow-500/70": !inLib,
                          "bg-green-600/70": inLib,
                        },
                        "w-fit"
                      )}
                      tooltip={
                        inLib
                          ? `This item is in your library.`
                          : `This item is *not* your library.`
                      }
                      onClick={async () => {
                        const local = inventory?.find(
                          (i) =>
                            i.title === selected?.title &&
                            i.size == selected?.size
                        ) as Item;
                        const id = local?.id;
                        if (local) await del(Number(id));
                        if (!local) await add(selected);
                        setSelected({
                          title: selected?.title,
                          size: selected?.size,
                        } as Item);
                        await loadLocalLists();
                      }}
                      icon={
                        inventory.some(
                          (i) =>
                            i.title === selected?.title &&
                            i.size == selected?.size
                        )
                          ? "FaCheck"
                          : "FaPlus"
                      }
                      label={selected?.size}
                    ></Chip>
                  );
                })}
              </div>
              {selected?.title?.match(/[$€]$/) && (
                <ActionButton
                  className="m-1"
                  level={1}
                  onDestruct={() => {
                    if (selected?.id)
                      upd(selected?.id, {
                        title: selected
                          ?.title!.replace(/\s\d+[%]/, "")
                          .replace(/\d+[$€]$/, ""),
                      });
                  }}
                  icon="FaHammer"
                ></ActionButton>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:w-[60%] md:w-full lg:w-[70%] pt-2">
              {perfumeIngredientsOdours[selected?.title] && (
                <div className="flex gap-2 flex-wrap">
                  {perfumeIngredientsOdours[selected?.title].map((odor) => {
                    return (
                      <OdorChip
                        filter={filter}
                        odor={odor}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   setFilter(toggle(filter, odor));
                        // }}
                      ></OdorChip>
                    );
                  })}
                </div>
              )}
              {perfumeIngredientsDesc[selected?.title] && (
                <p className="mb-0 overflow-y-auto h-full w-full p-2 text-base bg-white/20 rounded-md">
                  {perfumeIngredientsDesc[selected?.title]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="flex flex-col gap-1">
          <div className="bg-yellow-500/55 rounded-md p-2 flex gap-1 w-full">
            {getMostExpensive(emptyStock ? storedList : list || []).map(
              (entry, i) => {
                return (
                  <button
                    onClick={() => {
                      setSelected(entry);
                    }}
                    className={clsx(
                      "border-white  border-2 overflow-hidden bg-red-200 min-w-[116px] min-h-[116px] flex flex-col   items-center relative text-center border-[1.5px]  group max-w-[116px]",
                      "transition-all",
                      {
                        ["border-yellow-" + (7 - i) + "00"]: true,
                      }
                    )}
                  >
                    {ingredients[entry?.title?.trim()] && (
                      <img
                        className="brightness-[0.7]  blur-[1.2px] scale-110 group-hover:scale-100 group-hover:brightness-[1] group-hover:blur-[0px] transition-all"
                        src={ingredients[entry?.title?.trim()]}
                      />
                    )}
                    <p
                      className="backdrop-blur-[0.7px] shadow-md bg-black/40 w-full text-base absolute inline-flex flex-col top-[calc(50%-1rem)] group-hover:top-0 opacity-90 group-hover:opacity-100 transition-all"
                      style={{
                        textShadow:
                          "0px 0px 2px black, 0px 0px 3px black, 0px 0px 4px black, 1px 0px 1px black, -1px 0px 1px black, 0px 1px 1px black, 0px -1px 1px black",
                      }}
                    >
                      {entry.title}
                    </p>
                    <div className="absolute bottom-1 right-1 flex gap-1 ">
                      <AmountChip
                        className="h-fit"
                        amount={entry.size}
                        dilution={
                          entry.dilution === "100%" ? undefined : entry.dilution
                        }
                      ></AmountChip>
                    </div>
                  </button>
                );
              }
            )}
            <div className="bg-black/20 flex-1 rounded-r-md ml-1 -mr-2 -my-2"></div>
          </div>
          <div className="bg-green-500/55 rounded-md p-2 flex gap-1 w-full overflow-hidden">
            <div className="rounded-md overflow-hidden flex flex-wrap gap-1 w-full max-w-[600px]">
              {getMostOnStock(emptyStock ? storedList : list || []).map(
                (entry, i) => {
                  return (
                    <button
                      onClick={() => {
                        setSelected(entry);
                      }}
                      className={clsx(
                        "border-white  border-2 overflow-hidden bg-red-200 min-w-[116px] min-h-[116px] flex flex-col   items-center relative text-center border-[1.5px]  group max-w-[116px]",
                        "transition-all",
                        {
                          ["border-yellow-" + (7 - i) + "00"]: true,
                        }
                      )}
                    >
                      {ingredients[entry?.title?.trim()] && (
                        <img
                          className="brightness-[0.7]  blur-[1.2px] scale-110 group-hover:scale-100 group-hover:brightness-[1] group-hover:blur-[0px] transition-all"
                          src={ingredients[entry?.title?.trim()]}
                        />
                      )}
                      <p
                        className="backdrop-blur-[0.7px] shadow-md bg-black/40 w-full text-base absolute inline-flex flex-col top-[calc(50%-1rem)] group-hover:top-0 opacity-90 group-hover:opacity-100 transition-all"
                        style={{
                          textShadow:
                            "0px 0px 2px black, 0px 0px 3px black, 0px 0px 4px black, 1px 0px 1px black, -1px 0px 1px black, 0px 1px 1px black, 0px -1px 1px black",
                        }}
                      >
                        {entry.title}
                      </p>
                      <div className="absolute bottom-1 right-1 flex gap-1 ">
                        <AmountChip
                          className="h-fit"
                          amount={entry.size}
                          dilution={
                            entry.dilution === "100%"
                              ? undefined
                              : entry.dilution || undefined
                          }
                        ></AmountChip>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
            <div className="bg-black/20 flex-1 rounded-r-md  -mr-2 -my-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export type AmountChipProps = Component<{
  className?: string;
  amount: string;
  dilution?: string | null;
}>;
export const AmountChip = (props: AmountChipProps) => {
  const { className, amount, dilution } = props;
  return (
    <Chip
      className={clsx(
        "text-gray-200 text-xs flex py-1 items-center gap-2",
        {
          "bg-green-900/55": between(amountToNumber(amount), 500, 10000),
          "bg-green-700/55": between(amountToNumber(amount), 250, 500),
          "bg-green-500/55": between(amountToNumber(amount), 50, 250),
          "bg-yellow-700/55": between(amountToNumber(amount), 15, 50),
          "bg-orange-700/55": between(amountToNumber(amount), 5, 15),
          "bg-red-700/55": between(amountToNumber(amount), 0, 5),
        },
        className
      )}
      label={amount + (dilution ? " | " + dilution : "")}
    />
  );
};

export type IngredientItemProps = Component<{
  className?: string;
  items?: Item[];
  title: string;
  selected?: Partial<Item> | Partial<GroupedItem> | null;
  upd: (id?: number, item?: Partial<Item>) => void;
  toggleFilter?: (key: string) => void;
  setSelected: (item: Item | null) => void;
  setNotification: (v: string) => void;
  filter?: string[];
}> &
  Item;
export const IngredientItem = (props: IngredientItemProps) => {
  const {
    title,
    items,
    size,
    selected,
    upd,
    setSelected,
    list,
    source,
    toggleFilter,
    setNotification,
    filter,
  } = props;
  const entry = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let to: NodeJS.Timeout;

    if (selected?.title === title) {
      to = setTimeout(() => {
        ref?.current?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "nearest",
        });
      }, 1000);
    }
    return () => {
      clearTimeout(to);
    };
  }, [selected?.title, title]);

  const isSelected =
    selected?.title === props?.title &&
    (selected as Item)?.size === props?.size;
  return (
    <>
      <div
        ref={ref}
        className={clsx("flex gap-1 w-full items-center p-1", {
          "bg-white/40": isSelected,
        })}
        onClick={(e) => {
          e.stopPropagation();
          if ((e.target as HTMLElement).tagName === "INPUT") return;

          setSelected(isSelected ? null : props);
        }}
      >
        {entry?.items && (
          <img
            src={thumbnails[entry?.title] || ingredients[entry?.title]}
            className="w-8 h-8"
            // loading="lazy"
          ></img>
        )}
        {!Array.isArray(items) && (
          <input
            key={
              props.id +
              "" +
              (entry?.local ? entry?.local?.onStock : entry?.onStock)
            }
            className={clsx(
              "p-2 border-[1.5px] h-4 w-4 ml-9 disabled:border-gray-400 disabled:bg-gray-300",
              {
                "checked:bg-green-700/80":
                  list === props?.local?.list || list === props?.list,
                "checked:bg-yellow-500/80":
                  list !== props?.local?.list && list !== props.list,
                "disabled:checked:bg-green-700/40": 1,
                "border-yellow-400": props.onStock,
                "border-white": !props.onStock,
              }
            )}
            type="checkbox"
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!(props.local?.id || props.id)) return;
              upd(props?.local?.id || props?.id, {
                ...entry,
                onStock: e.target.checked,
                list: entry.list,
              });
              return false;
            }}
            checked={entry?.local ? entry?.local?.onStock : entry?.onStock}
          />
        )}
        {size && (
          <div className="">
            {amountToNumber(size)}
            {getAmountUnit(size)}
          </div>
        )}
        {entry?.dilution !== "100%" && (
          <div className="">{entry?.dilution}</div>
        )}

        {entry?.items && (
          <div className="flex flex-col">
            <span className="font-semibold ">{entry.title}</span>
            <span className="text-xs">
              {!!entry?.aliases?.length && (
                <em>{entry?.aliases?.join(", ")}</em>
              )}
            </span>
          </div>
        )}

        {!entry?.items && (
          <>
            <div className="">{getDisplayPrice(entry?.price)}</div>
            <div className="">{getPricePerUnit(entry)}</div>
          </>
        )}

        <div className="min-w-[4ch] ml-auto justify-end flex gap-1 my-auto">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {!entry?.items
                ? null
                : perfumeIngredientsOdours[entry?.title]
                    ?.slice(0, 3)
                    ?.map?.((key) => {
                      return (
                        <Chip
                          label={key}
                          className={clsx(
                            "flex items-start text-xs pb-[2px] whitespace-nowrap line-clamp-1",
                            {
                              "border-yellow-500 border-[1px]":
                                filter?.includes(key),
                              "text-gray-400":
                                !filter?.includes(key) && filter?.length,
                            }
                          )}
                          style={{
                            background:
                              OdorColors[key] +
                              (filter?.includes(key) || !filter?.length
                                ? "AA"
                                : "33"),
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter?.(key);
                          }}
                        />
                      );
                    })}
            </div>

            <div className="hidden flex gap-1">
              {entry?.tags &&
                !entry?.size &&
                entry?.tags?.map((tag) => {
                  return (
                    <Chip
                      className="text-xs"
                      label={tag}
                      icon={TagIcons[tag]}
                      style={{
                        backgroundColor: TagColors[tag],
                      }}
                    ></Chip>
                  );
                })}
            </div>
          </div>
          {between(getRawPricePerMl?.(entry), 10, 20) && (
            <Chip className="bg-yellow-500/30 w-fit" label="$"></Chip>
          )}
          {between(getRawPricePerMl?.(entry), 20, 30) && (
            <Chip className="bg-yellow-500/50 w-fit" label="$$"></Chip>
          )}
          {between(getRawPricePerMl?.(entry), 30, 100) && (
            <Chip className="bg-yellow-500/70 w-fit" label="$$$"></Chip>
          )}
          {between(getRawPricePerMl?.(entry), 100, 1000) && (
            <Chip className="bg-yellow-500/90 w-fit" label="🤯"></Chip>
          )}
        </div>
        {entry?.cas && !entry.size && (
          <Icon icon="MdOutlineVerified" className="h-6 w-6"></Icon>
        )}

        {false && selected?.title === entry?.title && !entry?.size && (
          <Chip
            label=""
            icon="FaLink"
            className="bg-white/30 hover:bg-white/50 items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copy(
                window.location.origin +
                  "/" +
                  i18next.language +
                  "/inventory/" +
                  source +
                  "/" +
                  encodeURIComponent(entry?.title)
              );
              setNotification("Copied URL!");
            }}
          >
            <Icon icon="FaCopy" className="h-5 w-5 my-1 "></Icon>
          </Chip>
        )}
      </div>
      {selected?.title === props.title && (
        <div className="flex flex-col " key={items?.length}>
          {items
            ?.slice()
            ?.sort((a, b) => {
              return getGrams(a.size) - getGrams(b.size);
            })
            .map((itm) => {
              return (
                <IngredientItem
                  key={itm.title}
                  {...itm}
                  cas={selected.cas}
                  title={title}
                  setNotification={setNotification}
                  id={itm.id}
                  upd={upd}
                  selected={selected}
                  setSelected={setSelected}
                  list={list}
                  source={source}
                ></IngredientItem>
              );
            })}
        </div>
      )}
    </>
  );
};

export type LocalListChipsProps = Component<{
  className?: string;
  listNames: string[];
  items: Item[];
  value: string | null;
  hasAll?: boolean;
  onChange?: (activeKey: string | null) => void;
  onDelete?: (activeKey: string | null) => void;
  onRemove?: (activeKey: string | null) => void;
  onAdd?: (activeKey: string | null) => void;
  setNotification?: (v: string) => void;
  showButtons?: boolean;
  toInventory?: boolean;
}>;
export const LocalListChips = (props: LocalListChipsProps) => {
  const {
    className,
    listNames,
    onChange,
    value,
    hasAll,
    onDelete,
    onRemove,
    onAdd,
    items,
    setNotification,
    showButtons = true,
    // toInventory = false,
  } = props;

  const [listAliases, setAliases] = useLocalStorage<Record<string, string>>(
    {},
    "listNames"
  );
  const [showEdit, setShowEdit] = useState(false);
  // const navigate = useNavigate();

  return (
    <div className="flex  gap-1 items-center flex-1 bg-white/20 p-1 rounded-md mb-1">
      {/* <NavButton
          internal
          className="text-blue-500  !mr-2"
          icon={toInventory ? "IoLibrary" : "FaFlask"}
          onClick={() =>
            navigate(
              !toInventory
                ? `/${i18next.language}/formula/compose?library=${value}`
                : `/${
                    i18next.language
                  }/inventory/Moe/${window.location.hash.slice(
                    1
                  )}?library=${value}&source=local`
            )
          }
        ></NavButton> */}
      {showEdit && (
        <Input
          placeholder={value || ""}
          onChange={(e) => {
            setAliases({
              [value as string]: (e.target as HTMLInputElement).value,
            });
          }}
        ></Input>
      )}

      {!showEdit &&
        listNames.map((key) => {
          return (
            <div className="h-fit">
              <Chip
                icon={
                  key === value
                    ? !showButtons
                      ? "IoLibrary"
                      : "FaDownload"
                    : undefined
                }
                label={listAliases[key] ? listAliases[key] : key}
                onRemove={
                  items?.length === 0 && value === key
                    ? () => {
                        onRemove?.(key);
                      }
                    : undefined
                }
                className={clsx(
                  "line-clamp-1 whitespace-nowrap",
                  "border-green-500 border-2",
                  {
                    "cursor-default": value === key && value === "Local",
                    "bg-purple-500/70": value === key,
                    "hover:bg-purple-300/30":
                      value === key && value !== "Local",
                    "hover:bg-purple-500/70": value !== key,
                    "bg-white/30": value !== key,
                  },
                  className
                )}
                iconClsn={clsx("w-auto h-auto", {
                  "!text-white ": hasAll,
                })}
                onClick={() => {
                  onChange?.(key === value ? null : key);
                }}
              ></Chip>
            </div>
          );
        })}

      <div className={clsx("flex gap-1 ml-auto", { hidden: !showButtons })}>
        {!!items?.length && (
          <IconButton
            className="h-7 w-7"
            icon="FaCopy"
            tooltip="Copy this list as text."
            id="copylistbtnb"
            round
            onClick={() => {
              const plain = items.reduce((txt, itm) => {
                return (
                  txt +
                  `${itm.size} ${itm.title} ${itm.dilution} ${itm.price}\n`
                );
              }, "# " + (listAliases[value || ""] || value || "Local") + ":\n");

              copy(plain);
              setNotification?.("Copied List!");
            }}
          ></IconButton>
        )}
        <IconButton
          className="h-7 w-7"
          icon="FaPlus"
          round
          tooltip="Add a new list."
          id="newlistbtn"
          onClick={() => {
            onAdd?.("List " + listNames?.length);
          }}
        ></IconButton>
        {items?.length > 0 && (
          <ActionButton
            id="clearlistaction"
            className={clsx("h-7 w-7", {})}
            tooltip="Clear this list."
            confirmTooltip="Cancel."
            level={2}
            icon="GrClear"
            round
            promptTitle="Empty this list?"
            promptText="This will delete all local ingredients from this list."
            onDestruct={(confirmed: boolean) => {
              if (confirmed) onDelete?.(value);
            }}
          ></ActionButton>
        )}
        {value !== "Local" && (
          <IconButton
            className="h-7 w-7"
            icon="FaPencil"
            id="editlistbtn"
            tooltip="Edit this list."
            round
            onClick={() => {
              setShowEdit?.(!showEdit);
            }}
          ></IconButton>
        )}
      </div>
    </div>
  );
};

export type NotificationProps = Component<{
  className?: string;
  title: string;
  setNotification: (v: string) => void;
}>;

export const Notification = (props: NotificationProps) => {
  const { setNotification, title } = props;

  useEffect(() => {
    const to = setTimeout(() => setNotification(""), 5000);
    return () => clearTimeout(to);
  }, [setNotification]);

  return (
    <div className="backdrop-blur-sm fixed top-2 right-1/2 translate-x-1/2 bg-blue-500/70 rounded-md font-semibold z-[1000] p-1 gap-0 flex items-center justify-between">
      <Icon
        icon="FaInfo"
        className="!text-blue-200 h-8 w-8 p-2 rounded-md bg-black/20 mr-2"
      ></Icon>
      <div className="p-2 bg-black/30 rounded-md text-white ">{title}</div>
      <IconButton
        // round
        className="!rounded-md !ml-1"
        icon="FaX"
        onClick={() => setNotification("")}
      ></IconButton>
    </div>
  );
};
