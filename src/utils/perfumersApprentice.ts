import { Item } from "@/components/Inventory";
import clsx from "clsx";

export const normalize = (itm: Item, i: number) => {
  return {
    ...itm,
    id: 11000 + (i + 1),
    quantity: 1,
    title: itm?.title?.replace(/\(.+?\)/, "").replace(/\s\*\*/g, "").trim(),
    tags: clsx({ flammable: /\(\s\*\*\)/.test(itm?.title) }).split(" "),
    onStock: true,
  };
};

export const groupByTitle = (arr: Item[]) => {
  const lkp = arr?.reduce((acc, itm, i) => {
    acc[itm.title] = acc[itm.title] || {
      title: itm.title,
      id: i,
      items: [],
    };
    if (acc[itm.title].items)
      acc[itm.title].items = [
        ...(acc[itm.title]?.items || []),
        {
          title: itm.title,
          amount: itm.amount,
          quantity: 1,
          price: itm.price,
          onStock: itm.onStock,
          remote: itm.remote,
          dilution: itm.dilution || "100%",
          list: itm.list,
          local: itm.local,
          id: itm.id,
        },
      ];
    return acc;
  }, {} as Record<string, Item>);
  return Object.values(lkp);
};
