import { Formula, FormulaItem } from "@/components/Inventory";
import { IDBFormula } from "./dataStructure";

export const isFormula = (formula: Formula): formula is Formula =>
  !!formula?.items?.length;

export const asFormula = (formula: any[]): Formula[] => formula;

export const isNotNull = <T>(val: T): val is NonNullable<T> => val !== null;

export const notNull = <T>(val: T): NonNullable<T> => {
  if (!val) throw new Error("Non nullable value can not be null");
  return val;
};
export const idbToFormula = (
  ingredientList: IDBFormula | undefined
): Formula | null => {
  if (!ingredientList) return  null;
  return {
    ...ingredientList,
    items: ingredientList?.ingredients as FormulaItem[],
  };
};
