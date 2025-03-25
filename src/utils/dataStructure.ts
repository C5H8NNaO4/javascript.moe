import { Formula, FormulaItem } from "@/components/Inventory";

export type IDBFormula = {
  title: string;
  id: number;
  ingredients: FormulaItem[];
};

export const adaptIndexedDBFormula = (frmla: IDBFormula): Formula => {
  return {
    title: frmla.title,
    id: frmla.id,
    items: frmla.ingredients,
  };
};
