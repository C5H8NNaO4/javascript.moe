import { useIndexedDB } from "react-indexed-db-hook";
import { DestructiveButton, IconButton } from "./Button";
import { ActionInput, Input } from "./Input";
import { List, ListItem } from "./List";
import { useEffect, useRef, useState } from "react";
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
} from "../static/descriptions";
import { Chip, Component, OdorChip } from "./Chip";
import { between } from "../utils/numbers";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { groupByTitle } from "@/utils/perfumersApprentice";
import { useCurrentBreakpoint, isSmaller } from "@/hooks/useBreakpoint";
import { Icon } from "./Icon";
import { toggle } from "@/lib/util";
import { importPlainText } from "@/utils/app";
import { useParams } from "react-router";
import i18next from "i18next";

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
        (getGrams(b.amount) - getGrams(a.amount)) * 2 +
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
export const getPriceInDollar = (price = "0$") => {
  // console.log ("GET GRAMS", amount)
  const raw = Number(price.replace(/[$€]/, ""));
  if (price.includes("€")) return raw * (1 / 0.92) + "$";
  if (price.includes("$")) return price;
  return raw;
};

export const getAmountUnit = (amount = "0g") => {
  return amount?.replace(/\d+/, "");
};

export const getPrice = (entry: Pick<Item, "price">) => {
  return Number(entry.price?.replace(/[$€]/, "") || 0);
};

export const getDilution = (entry: Pick<Item, "dilution">) => {
  return Number(entry.dilution?.replace(/[%]/, "")) || 100;
};

export const getRawPricePerMl = (
  entry: Pick<Item, "amount" | "price" | "dilution"> | null
) => {
  if (entry === null) return 0;
  const nr = getGrams(entry.amount);
  const prc = getPrice(entry);
  const dil = getDilution(entry);
  return Math.round(100 * (prc / nr) * (100 / dil)) / 100;
};

export const getPricePerUnit = (
  entry: Pick<Item, "amount" | "price" | "dilution"> | null
) => {
  if (entry === null) return 0;
  const nr = getGrams(entry.amount);
  const cur = getCurrency(entry.price);
  const prc = getPrice(entry);
  return (
    Math.round((prc / nr) * 100) / 100 + cur + "/" + getAmountUnit(entry.amount)
  );
};

export type Item = {
  id: string;
  title: string;
  quantity: number;
  price: string;
  amount: string;
  onStock?: boolean;
  dilution?: string | null;
  list?: string | null;
  remoteList?: string | null;
  items?: Item[];
  local?: Item | null;
  remote?: boolean;
};

type Inventories = Record<string, Item[]>;
export const InventoryList = ({
  list: initialList = [],
  inventories = { remote: {}, local: {} },
}: {
  list?: Item[];
  inventories: {
    remote: Inventories;
    local: Inventories;
  };
}) => {
  const db = useIndexedDB("inventory");
  const [storedListLkp, setStoredLkp] = useState<Record<string, Item[]>>({
    Local: [],
  });

  const params = useParams<{
    list: string;
    title: string;
  }>();

  const [hideOnStock, setHideOnStock] = useState<0 | 1 | 2>(0);
  const [invRemote, setInvRemote] = useState<string | null>(
    params?.list || "Moe"
  );
  const [invLocal, setInvLocal] = useState<string | null>("Local");
  const [sort, setSort] = useState<string>("+AZ");
  const [notification, setNotification] = useState<string>("");

  const storedList = storedListLkp[invLocal || "Local"] || [];
  const [localLists, setLocalLists] = useLocalStorage(
    Object.keys(inventories.local),
    "localLists"
  );

  const availList = invRemote ? inventories.remote?.[invRemote] : initialList;
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
                itm.amount === sitm.amount
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
          itm.title?.trim() === sitm.title?.trim() && itm.amount === sitm.amount
        );
      });
    });
  const list = !invRemote ? storedList : available;

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
    } as unknown as Item;
    setStoredLkp((list) => ({
      ...list,
      [invLocal || "Local"]: [...list[invLocal || "Local"], toAdd],
    }));
  };

  const del = async (id: string, noUpdate?: boolean) => {
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
    storedList.forEach((itm) => del(itm.id, true));
    setInvRemote(null);
  };
  const upd = async (
    id: string,
    {
      title,
      amount = "4ml",
      quantity = 1,
      onStock,
      price = "0$",
      dilution = "100%",
      list = "Local",
    }: Partial<Item>
  ) => {
    const existing =
      storedList.find((itm) => {
        return (
          !itm.items &&
          itm.id === id &&
          itm.amount === amount &&
          itm.title === title &&
          (!itm.list || itm.list === list)
        );
      }) || {};
    const index = storedList.findIndex((itm) => {
      return (
        !itm.items &&
        itm.id === id &&
        itm.amount === amount &&
        itm.title === title
      );
    });

    const toAdd = {
      ...existing,
      title: title!,
      amount,
      quantity,
      onStock,
      price,
      dilution,
      id,
      remote: false,
      list,
    };

    if (id) {
      await db.update({
        ...existing,
        ...toAdd,
        id,
      });
    } else {
      await db.add({
        ...existing,
        ...toAdd,
        id,
      });
    }

    setStoredLkp((storedList) => {
      const newList = { ...storedList };
      newList[invLocal || "Local"].splice(index, index > -1 ? 1 : 0, toAdd);
      return newList;
    });
  };
  useEffect(() => {
    if (!invLocal || !localLists?.includes(invLocal))
      setLocalLists([...Object.keys(inventories?.local)]);
    if (invLocal) load();
  }, [invLocal]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("OR");
  const [selected, setSelected] = useState<Item | null>(null);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showTags, setShowTags] = useState<boolean>(false);
  const bp = useCurrentBreakpoint({ current: document.body });
  const isMobile = isSmaller(bp, "md");
  const [listAliases] = useLocalStorage({}, "listNames");
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
  const grouped = groupByTitle(filtered) as Item[];
  const sorted = grouped.slice().sort((a: Item, b: Item) => {
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
      return (
        getGrams(a.items?.at(-1)?.amount) - getGrams(b.items?.at(-1)?.amount)
      );
    if (sort === "-amount")
      return (
        getGrams(b.items?.at(-1)?.amount) - getGrams(a.items?.at(-1)?.amount)
      );

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
  const uniqueIngredientsOnStock = [
    ...new Set(
      list
        .filter((itm) => {
          return itm.onStock;
        })
        .map((itm) => {
          return itm.title;
        })
    ),
  ];
  const totalValue = list
    .filter((itm) => {
      return itm.onStock;
    })
    .reduce((total, itm) => {
      return total + Number(itm.price?.replace("$", "")?.replace("€", "") || 0);
    }, 0);

  useEffect(() => {
    console.log("TITLE", params.title);
    const ingredient = inventories.remote[params?.list || "All"]?.find(
      (itm) => {
        return params.title === itm.title;
      }
    );
    console.log("TITLE", params.title, "INGREDIENT", ingredient);

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
        </div>
      )}

      <div className="flex gap-4 overflow-hidden flex-1">
        {(isMobile ? !selected : true) && (
          <div className="flex flex-col w-full basis-1/3 flex-1 h-full">
            <div className="flex justify-between flex-wrap mb-1 gap-1">
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

                          setInvRemote(key === invRemote ? "" : key);
                        }}
                      ></Chip>
                      {key === invRemote && !emptyStock && (
                        <IconButton
                          title={
                            !invLocal
                              ? "Select a local list to transfer items to."
                              : `Download items to the '${invLocal}' list in your indexed db.`
                          }
                          disabled={!invLocal || targetHasAll}
                          round
                          className="w-7 h-7 text-white  bg-green-700/70"
                          icon="FaArrowRightFromBracket"
                          onClick={async () => {
                            console.log("COPY", available?.length);
                            const onStock =
                              available?.filter((itm) => {
                                return itm.onStock;
                              }) || [];
                            for (const itm of onStock) {
                              await upd(itm.id, { ...itm, list: invLocal });
                            }
                          }}
                        ></IconButton>
                      )}
                    </div>
                  );
                })}
              </div>
              <LocalListChips
                listNames={localLists}
                onChange={(k: string | null) => setInvLocal(k || "Local")}
                onDelete={deleteList}
                setNotification={setNotification}
                onRemove={(key) => {
                  console.log("REMOVE", key, localLists);
                  setLocalLists(localLists?.filter((k: string) => k !== key));

                  if (invLocal === key) setInvLocal(localLists[0]);
                }}
                hasAll={targetHasAll}
                onAdd={(key: string | null) => {
                  setLocalLists([...localLists, key].filter(Boolean));
                }}
                items={storedList || []}
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
                        {...entry}
                        selected={selected}
                        upd={upd}
                        setSelected={setSelected}
                        list={invLocal}
                        remoteList={invRemote}
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
        {(isMobile ? !!selected : true) && (
          <div className="border-white flex flex-col md:basis-1/2 w-full md:max-w-[66%] md:flex-shrink pb-0">
            <div className="flex gap-1 flex-wrap justify-between bg-yellow-500/20 p-2 rounded-md items-center mb-2 h-fit">
              <div className="flex gap-1 flex-grow items-center">
                {selected?.title ? (
                  <h1 className="line-clamp-1">{selected?.title}</h1>
                ) : (
                  <h1 className="line-clamp-1">{invRemote}</h1>
                )}
              </div>
              <div className="flex gap-1 ml-auto justify-start flex-1 ">
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
                  className="mr-auto"
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
                <Chip
                  label={uniqueIngredientsOnStock?.length.toString()}
                  icon="FaBottleDroplet"
                  iconClsn="!h-5 !w-5"
                  className="ml-auto bg-blue-500 h-8 items-center text-lg font-semibold border-2 "
                ></Chip>
                <Chip
                  label={totalValue.toString()}
                  icon="FaDollarSign"
                  iconClsn="!h-5 !w-5"
                  className="bg-yellow-500 h-8 items-center text-lg font-semibold border-2"
                ></Chip>
                {selected && (
                  <IconButton
                    round
                    icon="FaX"
                    onClick={() => {
                      setSelected(null);
                    }}
                  ></IconButton>
                )}
              </div>
            </div>
            {!!selected?.title && (
              <div
                className={clsx(
                  "border-white border-[1px] max-w-full overflow-y-auto p-2 pb-2 rounded-md",
                  {
                    "border-yellow-500": between(
                      getRawPricePerMl(selected as Item),
                      30,
                      1000
                    ),
                    "bg-yellow-500/55": between(
                      getRawPricePerMl(selected as Item),
                      100,
                      1000
                    ),
                    "bg-orange-500/55": between(
                      getRawPricePerMl(selected as Item),
                      1,
                      100
                    ),

                    "bg-green-500/55": between(
                      getRawPricePerMl(selected as Item),
                      0.2,
                      1
                    ),
                    "bg-gray-400/55": between(
                      getRawPricePerMl(selected as Item),
                      0.1,
                      0.2
                    ),

                    "bg-gray-200/55": between(
                      getRawPricePerMl(selected as Item),
                      0,
                      0.1
                    ),
                  }
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
                    {<img src={ingredients[selected?.title?.trim()]} />}
                    <div className="flex flex-wrap gap-1 h-fit">
                      {selected?.remote && selected?.onStock && (
                        <Chip
                          icon="FaShoppingCart"
                          className="bg-yellow-500 w-fit"
                          label="Available"
                        ></Chip>
                      )}
                      {(selected?.local?.onStock ||
                        (!selected?.remote && selected?.onStock)) && (
                        <Chip
                          onClick={() =>
                            setInvLocal(selected?.local?.list || "Local")
                          }
                          icon="FaCheck"
                          className={clsx("w-fit", {
                            "bg-green-600":
                              invLocal === selected?.local?.list ||
                              invLocal === selected?.list,
                            "bg-yellow-500":
                              invLocal !== selected?.local?.list &&
                              invLocal !== selected?.list,
                          })}
                          label={
                            listAliases[
                              selected?.list || selected?.local?.list || "Local"
                            ] ||
                            selected?.list ||
                            selected?.local?.list ||
                            "In collection"
                          }
                        ></Chip>
                      )}
                      {between(
                        getRawPricePerMl?.(selected as Item),
                        10,
                        20
                      ) && (
                        <Chip className="bg-yellow-300 w-fit" label="$"></Chip>
                      )}
                      {between(
                        getRawPricePerMl?.(selected as Item),
                        20,
                        30
                      ) && (
                        <Chip className="bg-yellow-400 w-fit" label="$$"></Chip>
                      )}
                      {between(
                        getRawPricePerMl?.(selected as Item),
                        30,
                        100
                      ) && (
                        <Chip
                          className="bg-yellow-500 w-fit"
                          label="$$$"
                        ></Chip>
                      )}
                      {between(
                        getRawPricePerMl?.(selected as Item),
                        100,
                        1000
                      ) && (
                        <Chip className="bg-yellow-600 w-fit" label="🤯"></Chip>
                      )}
                    </div>
                    {selected?.amount && !selected?.remote && (
                      <DestructiveButton
                        className="m-1 !h-7 !w-7 "
                        level={1}
                        onDestruct={() => {
                          if (selected?.id) del(selected?.id);
                          setSelected({ title: selected?.title } as Item);
                        }}
                        icon="FaTrash"
                      ></DestructiveButton>
                    )}
                    {selected?.title?.match(/[$€]$/) && (
                      <DestructiveButton
                        className="m-1"
                        level={1}
                        onDestruct={() => {
                          if (selected?.id)
                            upd(selected?.id, {
                              title: selected?.title
                                .replace(/\s\d+[%]/, "")
                                .replace(/\d+[$€]$/, ""),
                            });
                        }}
                        icon="FaHammer"
                      ></DestructiveButton>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:w-[60%] md:w-full lg:w-[70%]">
                    <div className="flex gap-1">
                      {selected?.amount && (
                        <b className="flex">
                          {amountToNumber(selected?.amount) *
                            selected?.quantity}
                          {getAmountUnit(selected?.amount)}
                        </b>
                      )}
                      {/* <h2 className="line-clamp-1 w-fit">{selected?.title}</h2> */}
                      {selected?.price && (
                        <div className="flex gap-1 ml-auto">
                          <span>{selected?.price}</span>

                          <span>
                            ({getRawPricePerMl(selected)}
                            {selected?.price?.slice(-1)}/
                            {getAmountUnit(selected?.amount)})
                          </span>
                        </div>
                      )}
                    </div>
                    {perfumeIngredientsOdours[selected?.title] && (
                      <div className="flex gap-1 flex-wrap">
                        {perfumeIngredientsOdours[selected?.title].map(
                          (odor) => {
                            return (
                              <OdorChip
                                filter={filter}
                                odor={odor}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilter(toggle(filter, odor));
                                }}
                              ></OdorChip>
                            );
                          }
                        )}
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
                              amount={entry.amount}
                              dilution={
                                entry.dilution === "100%"
                                  ? undefined
                                  : entry.dilution
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
                                amount={entry.amount}
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
        )}
      </div>
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
  selected?: Partial<Item> | null;
  upd: (id: string, item: Partial<Item>) => void;
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
    amount,
    selected,
    upd,
    setSelected,
    list,
    remoteList,
    toggleFilter,
    setNotification,
    filter,
  } = props;
  const entry = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let to: number;
    console.log("SELECTED", selected?.title, title);
    if (selected?.title === title) {
      console.log("SELECTED!!", selected?.title, title);

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
  return (
    <>
      <div
        ref={ref}
        className={clsx("flex gap-1 w-full items-center p-1", {
          "bg-white/40":
            selected?.title === props?.title && selected?.id === props?.id,
        })}
        onClick={(e) => {
          e.stopPropagation();
          if ((e.target as HTMLElement).tagName === "INPUT") return;

          setSelected(selected?.id === props?.id ? null : props);
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
            key={props.id + entry?.local?.onStock}
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

              upd(props.id, {
                ...entry,
                onStock: !(entry?.remote
                  ? entry?.local?.onStock
                  : entry?.onStock),
                list: entry.list,
              });
              return false;
            }}
            checked={entry?.remote ? entry?.local?.onStock : entry?.onStock}
          />
        )}
        {amount && (
          <div className="">
            {amountToNumber(amount)}
            {getAmountUnit(amount)}
          </div>
        )}
        {entry?.dilution !== "100%" && (
          <div className="">{entry?.dilution}</div>
        )}
        {entry?.items && <div className="font-semibold">{entry.title}</div>}
        {!entry?.items && (
          <>
            <div className="">{entry.price}</div>
            <div className="">{getPricePerUnit(entry)}</div>
          </>
        )}

        <div className="min-w-[4ch] ml-auto justify-end flex gap-1 my-auto">
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
        {selected?.title === entry?.title && !entry?.amount && (
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
                  remoteList +
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
              return getGrams(a.amount) - getGrams(b.amount);
            })
            .map((itm) => {
              return (
                <IngredientItem
                  key={itm.title}
                  {...itm}
                  title={title}
                  setNotification={setNotification}
                  id={itm.id}
                  upd={upd}
                  selected={selected}
                  setSelected={setSelected}
                  list={list}
                  remoteList={remoteList}
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
  onChange: (activeKey: string | null) => void;
  onDelete: (activeKey: string | null) => void;
  onRemove: (activeKey: string | null) => void;
  onAdd: (activeKey: string | null) => void;
  setNotification: (v: string) => void;
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
  } = props;

  const [listAliases, setAliases] = useLocalStorage({}, "listNames");
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className="flex  gap-1 items-center flex-1 bg-white/20 p-1 rounded-md mb-1">
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
                icon={key === value ? "FaArrowRight" : undefined}
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
                    "bg-yellow-500/70": value === key,
                    "hover:bg-yellow-300/30":
                      value === key && value !== "Local",
                    "hover:bg-yellow-500/70": value !== key,
                    "bg-white/30": value !== key,
                  },
                  className
                )}
                iconClsn={clsx("w-auto h-auto", {
                  "!text-green-600 ": hasAll,
                })}
                onClick={() => {
                  onChange(key === value ? null : key);
                }}
              ></Chip>
            </div>
          );
        })}

      <div className="flex gap-1 ml-auto">
        {!!items?.length && (
          <IconButton
            className="h-7 w-7"
            icon="FaCopy"
            round
            onClick={() => {
              const plain = items.reduce((txt, itm) => {
                return (
                  txt +
                  `${itm.amount} ${itm.title} ${itm.dilution} ${itm.price}\n`
                );
              }, "# " + (listAliases[value || ""] || value || "Local") + ":\n");

              copy(plain);
              setNotification("Copied List!");
            }}
          ></IconButton>
        )}
        <IconButton
          className="h-7 w-7"
          icon="FaPlus"
          round
          onClick={() => {
            onAdd("List " + listNames?.length);
          }}
        ></IconButton>
        {items?.length > 0 && (
          <DestructiveButton
            className="h-7 w-7"
            level={2}
            icon="FaTrash"
            round
            promptTitle="Empty this list?"
            promptText="This will delete all local ingredients from this list."
            onDestruct={(confirmed: boolean) => {
              if (confirmed) onDelete?.(value);
            }}
          ></DestructiveButton>
        )}
        {value !== "Local" && (
          <IconButton
            className="h-7 w-7"
            icon="FaPencil"
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
  });

  return (
    <div className="fixed top-2 right-1/2 bg-blue-500/70 rounded-md font-semibold z-[1000] p-1 gap-2 flex items-center justify-between">
      <div className="p-2 bg-black/30 rounded-md">{title}</div>
      <IconButton
        round
        icon="FaX"
        onClick={() => setNotification("")}
      ></IconButton>
    </div>
  );
};
