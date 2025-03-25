import { FormulaItem } from "@/components/Inventory";
import { convert, totalUsedIngredientAmount } from "./util";

export const toText = (ings: FormulaItem[]) => {
  const total = ings.reduce(totalUsedIngredientAmount("g"), 0);
  return ings?.reduce((txt, ing) => {
    return (
      txt +
      `${ing.title} ${ing.dilution} ${Math.round(
        (1000 / total) *
          Number(convert(Number(ing.usedAmount), ing.unit || "g", "g"))
      )}ppt\n`
    );
  }, "");
};
