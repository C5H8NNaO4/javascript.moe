import { IngredientList } from "@/apollo/__generated__/schema.types";
import { Formula, FormulaItem } from "@/components/Inventory";
import { Maybe } from "graphql/jsutils/Maybe";

export const isFormula = (formula: Formula): formula is Formula =>
  !!formula?.items?.length;

export const asFormula = (formula: any[]): Formula[] => formula;

export const notNull = <T>(val: Maybe<T>): NonNullable<T> => {
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
