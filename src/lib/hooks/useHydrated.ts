import { FormulaItem } from "@/components/Inventory";

import { inventory, pellwall, perfumersApprentice } from "@/static/inventory";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";
import { useParams } from "react-router";

const invLkp = {
  All: [...pellwall, ...perfumersApprentice],
  Moe: inventory,
} as Record<string, NormalizedItem[]>;

export const useHydrated = (items: FormulaItem[]) => {
  const { list } = useParams();

  const lkpItems = invLkp[list || "Moe"];

  return items.map((formulaItem) => {
    const lkp = lkpItems.find(
      (itm) =>
        itm.title === formulaItem.title && itm.size === formulaItem.amount
    );
    return { ...lkp, ...formulaItem };
  });
};
