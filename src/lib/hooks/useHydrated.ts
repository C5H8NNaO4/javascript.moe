import { perfumersApprenticeInventory } from "@/static/data/ingredients/perfumersApprentice";
import { inventory } from "@/static/inventory";
import { HydratableItem } from "@/types/Item";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";
import { useParams } from "react-router";

const invLkp = {
  All: perfumersApprenticeInventory,
  Moe: inventory,
} as Record<string, NormalizedItem[]>;

export const useHydrated = (items: HydratableItem[]) => {
  const { list } = useParams();

  const lkpItems = invLkp[list || "Moe"];

  return items.map((item) => {
    const lkp = lkpItems.find(
      (itm) => itm.title === item.title && itm.size === item.size
    );
    return { ...lkp, ...item };
  });
};
