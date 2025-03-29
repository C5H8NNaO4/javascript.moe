import { formatCurrency, totalIngredientCostPerMl } from "@/lib/util";
import { Chip } from "../Chip";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";

export const CostPerMlChip = ({ items }: { items: NormalizedItem[] }) => {
  const cost = totalIngredientCostPerMl(items);
  const formattedCost = formatCurrency(cost, "USD");
  return (
    <Chip
      icon="FaDollarSign"
      className="bg-yellow-500"
      label={formattedCost + '/ml'}
    ></Chip>
  );
};
