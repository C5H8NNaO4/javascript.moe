import { IngredientList } from "@/apollo/__generated__/schema.types";
import { Formula, FormulaItem } from "@/components/Inventory";

export const isFormula = (formula: Formula): formula is Formula =>
  !!formula?.items?.length;

export const asFormula = (formula: any[]): Formula[] => formula;

export const isNotNull = <T>(val: T): val is NonNullable<T> => val !== null;

export const notNull = <T>(val: T): NonNullable<T> => {
  if (!val) throw new Error("Non nullable value can not be null");
  return val;
};
export const ingredientListAsFormula = (
  ingredientList: IngredientList | undefined
): Formula | null => {
  if (!ingredientList) return ingredientList || null;
  return {
    items: ingredientList?.items as FormulaItem[],
  };
};
