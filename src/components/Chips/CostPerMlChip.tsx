import { formatCurrency, totalIngredientCostPerMl } from "@/lib/util";
import { Chip } from "../Chip";
import { Item } from "../Inventory";

export const CostPerMlChip = ({ items }: { items: Item[] }) => {
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
