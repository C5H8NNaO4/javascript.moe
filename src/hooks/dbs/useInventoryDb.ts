import { Item, LocalInventories } from "@/components/Inventory";
import { DB_INVENTORY } from "@/const/indexedDBNames";
import { useIndexedDB } from "react-indexed-db-hook";
import { useLocalStorage } from "../useLocalStorage";
import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { normalize } from "@/utils/perfumersApprentice";

const localInvAtom = atom({} as Record<string, Item[]>);
export const useLocalInventories = (
  inventories: LocalInventories,
  invLocal: string | null
): [Record<string, Item[]>, any] => {
  const db = useIndexedDB("inventory");

  const [storedLkp, setStoredLkp] = useAtom(localInvAtom);
  const storedList = storedLkp[invLocal || "Local"] || [];

  const [localLists, setLocalLists] = useLocalStorage(
    Object.keys(inventories || {}),
    "localLists"
  );
  const loadLocalLists = useCallback(async () => {
    const res = (await db.getAll()) || [];
    setLocalLists(
      [
        ...new Set([
          ...Object.keys(inventories),
          ...localLists,
          ...res.flatMap((itm) => {
            return itm?.list?.split(", ");
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
  }, []);

  useEffect(() => {
    loadLocalLists();
  }, [loadLocalLists]);


  useEffect(() => {
    console.log ("USE LOCAL INV")
  })
  const add = async ({ id, ...props }: Partial<Item>) => {
    if (!invLocal) return;
    await db.add({ ...props, list: invLocal });

    // setStoredLkp((list) => ({
    //   ...list,
    //   [invLocal || "Local"]: [...list[invLocal || "Local"], toAdd],
    // }));

    if (inventories[invLocal]) await loadLocalLists();
    else {
      setLocalLists([...new Set([...localLists, invLocal])]);
    }
  };

  const del = async (id: number, noUpdate?: boolean) => {
    await db.deleteRecord(id);
    if (noUpdate) return;
    const index = storedList.findIndex((itm) => {
      return Number(itm.id) === id;
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
    // setInvRemote(null);
  };
  const upd = async (id?: number, item?: Item) => {
    if (!item) return;
    const {
      title,
      size = "4ml",
      onStock,
      quantity = 1,
      price = "0$",
      dilution = "100%",
      list,
      attributes = [],
      source,
    } = item;

    const existing =
      storedList.find((itm) => {
        return itm.id === id && itm.size === size && itm.title === title;
      }) || {};

    const toAdd = normalize({
      title: title!,
      size,
      quantity,
      onStock,
      price,
      dilution,
      remote: false,
      source,
      list,
      attributes,
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
        onStock: true,
      });
    }

    setTimeout(() => {
      loadLocalLists();
    }, 0);
  };

  const toggle = (entry: Item, checked: boolean) => {
    if (!invLocal) return;
    const list =
      typeof entry?.local?.list !== "string"
        ? []
        : (entry.local?.list || "")
            ?.split(", ")
            .filter(Boolean)
            .map((l: string) => l.trim());
    if (!checked) {
      list.splice(list.indexOf(invLocal), 1);
    } else if (!list.includes(invLocal)) {
      list.push(invLocal);
    }

    upd(entry?.local?.id, {
      ...(entry.local || entry),
      onStock: checked,
      list: list.sort().join(", "),
    });
  };
  return [
    storedLkp,
    {
      del,
      add,
      deleteList,
      upd,
      refetch: loadLocalLists,
      toggle,
      localListNames: localLists,
      setLocalLists,
    },
  ];
};
export default () => useIndexedDB(DB_INVENTORY);
