import { Item } from "@/components/Inventory";
import clsx from "clsx";

type RawItem = Omit<Item, "tags" | "aliases">;
export const normalize = (itm: RawItem, i?: number): Item => {
  const norm = {
    ...itm,
    id: itm.id || (11000 + (Number(i) + 1)).toString(),
    dilution: /\d+%/.exec(itm?.title)?.[0] || "100%",
    quantity: 1,
    title: itm?.title
      .replace(/\s\*\*/g, "")
      .replace(/\s\(Natural\)/, "")
      .trim(),
    tags: clsx({
      absolute: /Absolute/.test(itm?.title),
      flammable: /\(\s\*\*\)/.test(itm?.title),
      natural: /\(Natural\)/.test(itm?.title) || /P&N/.test(itm?.title),
    }).split(" "),
    aliases: [] as string[],
    onStock: true,
  };

  if (/a\.k\.a .+$/.test(norm?.title) || /\(.+?\)/.test(norm?.title)) {
    const aliasReg = /\((.+?)\)/;
    const akaReg = /a\.k\.a (.+)$/;
    const aka = akaReg.exec(norm?.title);
    const alias = aliasReg.exec(norm?.title);
    if (aka?.[1]) {
      norm.aliases.push(aka?.[1]);
      norm.title = norm.title.replace(akaReg, "");
    }
    if (alias?.[1]) {
      norm.aliases.push(alias?.[1]);
      norm.title = norm.title.replace(aliasReg, "");
    }
  }
  return norm;
};

export const groupByTitle = (arr: Item[]) => {
  const lkp = arr?.reduce((acc, itm, i) => {
    acc[itm.title] = acc[itm.title] || {
      title: itm.title,
      tags: itm.tags,
      aliases: itm.aliases,
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
          tags: itm.tags,
          aliases: itm.aliases,
        },
      ];
    return acc;
  }, {} as Record<string, Item>);
  return Object.values(lkp);
};
